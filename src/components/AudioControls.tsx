import { FontAwesome5 } from "@expo/vector-icons";
import { logSermonPause } from "@src/analytics";
import { useAudio } from "@src/hooks/useAudio";
import { useAudioStore } from "@src/store";
import colors from "@src/styles/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function AudioControls() {
  const { sound, playingAudioObject, isPlaying } = useAudioStore();
  const { playSound, pauseSound, stopSound } = useAudio();

  const pause = () => {
    pauseSound();
    logSermonPause();
  };

  if (!sound) {
    return <></>;
  }

  // TODO: Truncate and scroll long titles
  return (
    <View style={styles.audioControlContainer}>
      <Text style={styles.playingSermonText}>{playingAudioObject?.title}</Text>
      <View style={styles.audioControlButtons}>
        {isPlaying ? (
          <TouchableOpacity style={{ marginRight: 25 }} onPress={pause}>
            <FontAwesome5 name="pause" size={24} color={colors.blue} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ marginRight: 25 }}
            onPress={() => playSound(null)}
          >
            <FontAwesome5 name="play" size={24} color={colors.blue} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={{ marginRight: 15 }} onPress={stopSound}>
          <FontAwesome5 name="stop" size={24} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  audioControlButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
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
  playingSermonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    verticalAlign: "middle",
    color: "#333",
    width: "50%",
  },
});
