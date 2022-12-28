import React, { useState } from "react";
import { View, StyleSheet, Animated, ScrollView } from "react-native";
import useStore from "../Store";
import HeaderChip from "./HeaderChip";
import KeywordChip from "./KeywordChip";

const prompts: string[] = [
  "I am worried about...",
  "I am grateful for...",
  "I am struggling with...",
  "I am curious about...",
  "I am feeling...",
].sort(() => 0.5 - Math.random());

const KeywordManager: React.FC = () => {
  const { promptStart, setPromptStart } = useStore((state) => ({
    promptStart: state.promptStart,
    setPromptStart: state.setPromptStart,
  }));

  const handlePress = (e: string) => {
    if (promptStart !== e) setPromptStart(e);
    else setPromptStart(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {prompts.map((prompt, index) => (
          <KeywordChip
            key={index}
            keyword={prompt}
            onPress={() => handlePress(prompt)}
            active={promptStart === prompt}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "80%",
    marginTop: 24,
  },
});
export default KeywordManager;
