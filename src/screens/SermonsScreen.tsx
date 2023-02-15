import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { formatDate } from "../utils";

// TODO: Style this puppy
export default function SermonsScreen() {
  const { sermons, loading } = useSermons();
  const [sound, setSound] = useState<any>();
  const [playingFilename, setPlayingFilename] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
          setPlayingFilename(null);
          setIsPlaying(false);
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (playingFilename) {
      playSound();
    }
  }, [playingFilename]);

  async function pauseSound() {
    console.log("Pausing sound...");
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function stopSound(): Promise<void> {
    console.log("Stopping sound...");
    if (sound) {
      if (sound.getStatusAsync().isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      setSound(null);
      setPlayingFilename(null);
      setIsPlaying(false);
    }
  }

  async function playSound(): Promise<void> {
    console.log("Playing sound...");
    if (sound) {
      console.log("Sound is loaded, resuming...");
      sound.playAsync();
    } else {
      if (!playingFilename) {
        console.error("Cannot play sound, no filename is set");
        return;
      }

      console.log("Sound is not loaded, loading...");
      const sermon = ref(storage, playingFilename);
      const uri = await getDownloadURL(sermon);
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(playbackObject);
    }
    setIsPlaying(true);
  }

  async function startPlayingSermon(sermon: TSermon) {
    setPlayingFilename(sermon.filename);
  }

  return (
    <SafeAreaView style={styles.superContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sermons</Text>
        <View style={styles.sermonsContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            sermons.map((sermon) => (
              <TouchableOpacity
                key={sermon.id}
                onPress={() => startPlayingSermon(sermon)}
              >
                <Sermon sermon={sermon} key={sermon.id} />
              </TouchableOpacity>
            ))
          )}
        </View>
        {!!sound ? (
          <AudioControls
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
  playingAudio: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

function AudioControls(props: AudioControlsProps) {
  const { playingAudio, onPlay, onPause, onStop } = props;

  return (
    <View style={styles.buttonContainer}>
      <>
        {playingAudio ? (
          <TouchableOpacity style={styles.button} onPress={onPause}>
            <FontAwesome5 name="pause" size={24} color={colors.blue} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onPlay}>
            <FontAwesome5 name="play" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={onStop}>
          <FontAwesome5 name="stop" size={24} color={colors.blue} />
        </TouchableOpacity>
      </>
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
      <Text style={styles.sermonDate}>{formatDate(sermon.createdAt)}</Text>
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
    verticalAlign: "middle",
    backgroundColor: "#fff",
    padding: 24,
  },
  sermonContainer: {
    marginVertical: 10,
  },
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
  sermonDate: {
    fontSize: 14,
    paddingTop: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 30,
    backgroundColor: colors.darkPaper,
  },
  button: {},
});
