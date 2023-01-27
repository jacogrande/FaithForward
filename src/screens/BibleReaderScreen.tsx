import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import apiConfig from "../../apiConfig";
import { auth } from "../../firebase";
import { useApi } from "../services/api";
import useStore from "../Store";
import colors from "../styles/colors";

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

const BibleReaderScreen: React.FC = () => {
  const selectedVerse = useStore((state) => state.selectedVerse);
  const promptId = useStore((state) => state.promptId);

  const { isLoading, data, fetch } = useApi<{ verses: IVerse[] }>(
    `${apiConfig.apiUrl}/getBiblePassage`,
    {
      method: "POST",
      body: JSON.stringify({
        verse: getVerseReference(selectedVerse),
        promptId: promptId,
        userId: auth.currentUser?.uid,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  React.useEffect(() => {
    if (selectedVerse) {
      fetch();
    }
  }, [selectedVerse]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );

  // Adds verse numbers to the chapter
  const formatChapter = () => {
    if (!data) return null;
    let chapter = "";
    for (let verse of data.verses) {
      chapter += `(${verse.verse_nr}) ${verse.verse.trim()} `;
    }
    return chapter;
  };

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
