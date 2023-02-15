import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { storage } from "../../firebase";
import colors from "../styles/colors";

export default function SermonsScreen() {
  const [sound, setSound] = useState<any>();

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading sound...");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  console.log("sound", sound);

  async function pauseSound() {
    console.log("Pausing sound...");
    if (sound) {
      await sound.pauseAsync();
    }
  }

  async function stopSound() {
    console.log("Stopping sound...");
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  const playSound = async () => {
    console.log("Playing sound...");
    if (sound) {
      console.log("Sound is loaded, resuming...");
      sound.playAsync();
    } else {
      console.log("Sound is not loaded, loading...");
      const sermon = ref(storage, "bella-on-love.mp3");
      const uri = await getDownloadURL(sermon);
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(playbackObject);
    }
  };

  // TODO: Return a list of all sermons in Firebase Storage
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sermons</Text>
      <Sermon onPlay={playSound} onPause={pauseSound} onStop={stopSound} />
    </SafeAreaView>
  );
}

interface SermonProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

function Sermon(props: SermonProps) {
  const { onPlay, onPause, onStop } = props;

  return (
      <View style={styles.sermonsContainer}>
        <View>
          <Text style={styles.sermonTitle}>On Love</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onPlay}>
            <FontAwesome5 name="play" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPause}>
            <FontAwesome5 name="pause" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onStop}>
            <FontAwesome5 name="stop" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sermonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    verticalAlign: "middle",
    backgroundColor: "#fff",
    padding: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 20,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "80%",
  },
  button: {
    marginHorizontal: 10,
  },
});
