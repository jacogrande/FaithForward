import { FontAwesome5 } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { storage } from "../../firebase";
import { TSermon } from "../../types";
import { useSermons } from "../hooks/useSermons";
import colors from "../styles/colors";

export default function SermonsScreen() {
  const { sermons, loading } = useSermons();
  const [sound, setSound] = useState<any>();
  const [playingSermon, setPlayingSermon] = useState<TSermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <SafeAreaView style={styles.superContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sermons</Text>
        </View>
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
                <TouchableOpacity
                  onPress={() => startPlayingSermon(sermon)}
                  style={[
                    styles.button,
                    playingSermon?.id === sermon.id ? styles.buttonActive : {},
                  ]}
                >
                  <Text style={[styles.buttonText]}>
                    {playingSermon?.id === sermon.id && !!sound
                      ? "Playing"
                      : playingSermon?.id === sermon.id && !sound
                      ? "Loading..."
                      : "Play"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text>No sermons to display.</Text>}
            ListFooterComponent={<View style={{ height: 100 }} />}
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
      </View>
    </SafeAreaView>
  );
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
          <TouchableOpacity onPress={onPause}>
            <FontAwesome5 name="pause" size={24} color={colors.blue} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPlay}>
            <FontAwesome5 name="play" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onStop}>
          <FontAwesome5 name="stop" size={24} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface SermonProps {
  sermon: TSermon;
}

function Sermon(props: SermonProps) {
  const { sermon } = props;

  return (
    <View style={styles.sermonContainer}>
      <Text style={styles.sermonTitle}>{sermon.title}</Text>
      <Text style={styles.sermonDescription}>{sermon.description}</Text>
      <Text style={styles.sermonSpeaker}>with {sermon.speaker}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  sermonsContainer: {
    backgroundColor: "#fff",
    padding: 24,
  },
  sermonSection: {
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 2,
    marginBottom: 10,
    paddingVertical: 20,
  },
  sermonContainer: {},
  header: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
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
    paddingVertical: 10,
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
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "50%",
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: "100%",
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
});
