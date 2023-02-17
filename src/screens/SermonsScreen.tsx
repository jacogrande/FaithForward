import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
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
        console.log("Playing...");
      } else {
        console.log("Paused...");
      }

      // TODO: Properly handle buffering state
      if (playbackStatus.isBuffering) {
        console.log("Buffering...");
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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Sermons</Text>
        {loading ? (
          <ActivityIndicator />
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
      </ScrollView>
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
    paddingBottom: 100
  },
  sermonSection: {
    borderTopColor: colors.lightBlue,
    borderTopWidth: 2,
    marginVertical: 10,
    padding: 10,
  },
  sermonContainer: {},
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
  },
  sermonDescription: {
    fontSize: 16,
    paddingTop: 10,
  },
  sermonSpeaker: {
    fontSize: 14,
    paddingVertical: 10,
    fontStyle: "italic",
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
});
