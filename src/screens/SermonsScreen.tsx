import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import humanizeDuration from "humanize-duration";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  auth,
  favoriteSermon,
  storage,
  unfavoriteSermon,
} from "../../firebase";
import { TSermon } from "../../types";
import { Container } from "../components/Container";
import { useRequestReview } from "../hooks/useRequestReview";
import { useSermons } from "../hooks/useSermons";
import colors from "../styles/colors";

function initOptimisticFaves(sermons: TSermon[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return sermons
    .filter((sermon) =>
      sermon.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((sermon) => sermon.id);
}

export default function SermonsScreen() {
  const { sermons, loading, refreshing, setRefreshing, setQuietlyRefreshing } =
    useSermons();
  const [sound, setSound] = useState<any>();
  const [playingSermon, setPlayingSermon] = useState<TSermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [optimisticFaves, setOptimisticFaves] = useState<string[]>(
    initOptimisticFaves(sermons)
  );
  const { requestReview } = useRequestReview();

  useEffect(() => {
    setOptimisticFaves(initOptimisticFaves(sermons));
  }, [JSON.stringify(sermons)]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
    });
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
          setPlayingSermon(null);
          setIsPlaying(false);
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (!!playingSermon) {
      playSound();
    } else {
      stopSound();
    }
  }, [JSON.stringify(playingSermon)]);

  async function pauseSound() {
    console.log("Pausing sound...");
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function stopSound(): Promise<void> {
    if (sound) {
      if (sound.getStatusAsync().isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      setSound(null);
      setPlayingSermon(null);
      setIsPlaying(false);
    }
  }

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.error(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      // TODO: Refactor play/pause handlers into these
      if (playbackStatus.isPlaying) {
        //console.log("Playing...");
      } else {
        //console.log("Paused...");
      }

      // TODO: Properly handle buffering state
      if (playbackStatus.isBuffering) {
        //console.log("Buffering...");
      }

      // TODO: Figure out why we have to manually setSound etc
      //       stopSound doesn't do the trick because sound is null
      //       but playingSermon isn't? Weird
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        console.log("Finished playing");
        setSound(null);
        setPlayingSermon(null);
        setIsPlaying(false);
        requestReview();
      }
    }
  };

  async function playSound(): Promise<void> {
    console.log("Playing sound...");
    if (sound) {
      console.log("Sound is loaded, resuming...");
      sound.playAsync();
    } else {
      if (!playingSermon) {
        console.error("Cannot play sound, no filename is set");
        return;
      }

      console.log("Sound is not loaded, loading...");
      const sermon = ref(storage, playingSermon.filename);
      const uri = await getDownloadURL(sermon);
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(playbackObject);
      // Call stopSound when audio finishes playing
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
    setIsPlaying(true);
  }

  async function startPlayingSermon(sermon: TSermon) {
    if (playingSermon?.id === sermon.id) {
      playSound();
    } else {
      await stopSound();
      setPlayingSermon(sermon);
    }
  }

  async function handleFavoritingSermon(sermon: TSermon) {
    setOptimisticFaves([...optimisticFaves, sermon.id]);
    await favoriteSermon(sermon);
    setQuietlyRefreshing(true);
  }

  async function handleUnfavoritingSermon(sermon: TSermon) {
    setOptimisticFaves(optimisticFaves.filter((id) => id !== sermon.id));
    await unfavoriteSermon(sermon);
    setQuietlyRefreshing(true);
  }

  return (
    <Container>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          style={styles.sermonsContainer}
          data={sermons}
          keyExtractor={(sermon: TSermon) => sermon.id}
          renderItem={({ item: sermon }: { item: TSermon }) => (
            <View style={styles.sermonSection}>
              <Sermon sermon={sermon} />
              <View style={styles.actionButtons}>
                <Text style={styles.sermonSpeaker}>
                  {formatDuration(sermon.duration || null)} with{" "}
                  {sermon.speaker}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <View style={{ marginRight: 20 }}>
                    {playingSermon?.id === sermon.id && !!sound ? (
                      <SermonPauseButton />
                    ) : playingSermon?.id === sermon.id && !sound ? (
                      <ActivityIndicator size={20} color={colors.blue} />
                    ) : (
                      <SermonPlayButton
                        onPress={() => startPlayingSermon(sermon)}
                      />
                    )}
                  </View>
                  {optimisticFaves.includes(sermon.id) ? (
                    <TouchableOpacity
                      onPress={() => handleUnfavoritingSermon(sermon)}
                    >
                      <Ionicons
                        name="heart-sharp"
                        size={24}
                        color={colors.red}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleFavoritingSermon(sermon)}
                    >
                      <Ionicons
                        name="heart-outline"
                        size={24}
                        color={colors.red}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>No sermons to display.</Text>}
          ListFooterComponent={<View style={{ height: 100 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
          }
        />
      )}
      {!!sound ? (
        <AudioControls
          title={playingSermon?.title || ""}
          playingAudio={isPlaying}
          onPlay={playSound}
          onPause={pauseSound}
          onStop={stopSound}
        />
      ) : null}
    </Container>
  );
}

function SermonPlayButton(props: { onPress: () => void }) {
  const { onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome5 name="play" size={20} color={colors.blue} />
    </TouchableOpacity>
  );
}

function SermonPauseButton() {
  return (
    <AntDesign name="sound" size={28} color={colors.blue} />
  )
}

interface AudioControlsProps {
  title: string;
  playingAudio: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

function AudioControls(props: AudioControlsProps) {
  const { title, playingAudio, onPlay, onPause, onStop } = props;

  // TODO: Truncate and scroll long titles
  return (
    <View style={styles.audioControlContainer}>
      <Text style={styles.playingSermonText}>{title}</Text>
      <View style={styles.audioControlButtons}>
        {playingAudio ? (
          <TouchableOpacity style={{ marginRight: 25 }} onPress={onPause}>
            <FontAwesome5 name="pause" size={24} color={colors.blue} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ marginRight: 25 }} onPress={onPlay}>
            <FontAwesome5 name="play" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={{ marginRight: 15 }} onPress={onStop}>
          <FontAwesome5 name="stop" size={24} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Duration is a float in seconds
const formatDuration = (duration: number | null): string => {
  // Duration is either a float in seconds, or null
  if (duration === null) {
    return "Time";
  }

  return humanizeDuration(duration * 1000, { round: true, units: ["m"] });
};

interface SermonProps {
  sermon: TSermon;
}

function Sermon(props: SermonProps) {
  const { sermon } = props;

  return (
    <View>
      <Text style={styles.sermonTitle}>{sermon.title}</Text>
      <Text style={styles.sermonDescription}>{sermon.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sermonsContainer: {
    backgroundColor: "#fff",
    padding: 24,
  },
  sermonSection: {
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 2,
    paddingVertical: 24,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  sermonDescription: {
    fontSize: 16,
    paddingBottom: 10,
  },
  sermonSpeaker: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
    /* paddingVertical: 10, */
  },
  audioControlContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.lightBlue,
    zIndex: 10,
    opacity: 1,
    borderTopColor: colors.blue,
    borderTopWidth: 1,
  },
  audioControlButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 18,
    /* width: "50%", */
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  playingSermonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    verticalAlign: "middle",
    color: "#333",
    width: "50%",
  },
  buttonActive: {
    backgroundColor: colors.orange,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
