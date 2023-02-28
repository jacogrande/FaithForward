import { Loading } from "@src/components/Loading";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useApi } from "@src/hooks/useApi";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface IVerse {
  verse_nr: number;
  verse: string;
}
const getVerseReference = (verse: string | null) => {
  if (!verse) return null;
  const splits = verse.split("(");
  const reference = splits[splits.length - 1].replace(")", "");
  return reference;
};

// TODO: use BibleScreen
const BibleReaderScreen: React.FC = () => {
  const selectedVerse = useStore((state) => state.selectedVerse);
  const promptId = useStore((state) => state.promptId);

  const {
    isLoading,
    data,
    fetchData: getBibleChapter,
  } = useApi<{ verses: IVerse[] }>(`${API_URL}/getBiblePassage`, {
    method: "POST",
    body: JSON.stringify({
      verse: getVerseReference(selectedVerse),
      promptId: promptId,
      userId: auth.currentUser?.uid,
    }),
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (selectedVerse) {
      getBibleChapter();
    }
  }, [selectedVerse]);

  // Adds verse numbers to the chapter
  const formatChapter = () => {
    if (!data) return null;
    let chapter = "";
    for (let verse of data.verses) {
      chapter += `(${verse.verse_nr}) ${verse.verse.trim()} `;
    }
    return chapter;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {getVerseReference(selectedVerse)?.split(":")[0]}
        </Text>
        <Text style={styles.text}>{formatChapter()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 48,
  },
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
  },
  text: {
    fontSize: 16,
    marginHorizontal: "10%",
    padding: 8,
    color: "#333",
    lineHeight: 28,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Baskerville",
    color: "#333",
  },
  verseNumber: {
    fontSize: 14,
    // lineHeight: 12,
  },
});

export default BibleReaderScreen;
