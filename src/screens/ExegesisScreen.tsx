import { useBibleStore } from "@src/store";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function ExegesisScreen() {
  const { verse, book, chapter, verseNumber, exegesis } = useBibleStore();

  if (!verse || !book || !chapter || !verseNumber || !exegesis) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1 bg-ffPaper"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-ffPaper justify-center items-center mb-20">
        <Text style={[styles.text, styles.highlight]}>{`${formatVerse(verse)}
- ${book} ${chapter}:${verseNumber}`}</Text>
        <Text style={styles.text}>{exegesis}</Text>
      </View>
    </ScrollView>
  );
}

function formatVerse(verse: string): string {
  // Add quotes around the verse only if it doesn't already have them
  if (verse.startsWith('"') && verse.endsWith('"')) {
    return verse;
  }
  return `"${verse}"`;
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
    marginVertical: 15,
  },
  text: {
    fontSize: 16,
    marginHorizontal: "10%",
    padding: 8,
    color: "#333",
    lineHeight: 28,
  },
});

export default ExegesisScreen;
