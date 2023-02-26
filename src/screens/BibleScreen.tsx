import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  PanResponder,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import apiConfig from "../../apiConfig";
import bookList from "../data/bookList";
import { useApi } from "../hooks/useApi";
import colors from "../styles/colors";

interface IVerse {
  verse_nr: number;
  verse: string;
}

const BibleScreen = () => {
  const [book, setBook] = useState<string>("Genesis");
  const [chapter, setChapter] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pan, setPan] = useState(new Animated.ValueXY());

  const nextChapter = () => {
    const currentBook = bookList[book];
    if (chapter < currentBook.chapters) {
      setChapter(chapter + 1);
    } else {
      const nextBook = currentBook.nextBook;
      if (nextBook) {
        setBook(nextBook);
        setChapter(1);
      }
    }
    pan.setValue({ x: 0, y: 0 });
  };

  const previousChapter = () => {
    const currentBook = bookList[book];
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else {
      const prevBook = currentBook.prevBook;
      if (prevBook) {
        setBook(prevBook);
        setChapter(bookList[prevBook].chapters);
      }
    }
    pan.setValue({ x: 0, y: 0 });
  };

  const {
    isLoading,
    data,
    fetchData: getBibleChapter,
  } = useApi<{ chapter: IVerse[] }>(
    `${apiConfig.apiUrl}/fetchChapter?book=${book}&chapter=${chapter}`
  );

  // Adds verse numbers to the chapter
  // const formatChapter = () => {
  //   if (!data || !data.chapter) {
  //     setError("Couldn't load chapter. Please try again later.");
  //     return null;
  //   }
  //   let chapterText = "";
  //   for (let verse of data.chapter) {
  //     chapterText += `(${verse.verse_nr}) ${verse.verse.trim()} `;
  //   }
  //   return chapterText;
  // };

  useEffect(() => {
    try {
      getBibleChapter();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  }, [book, chapter]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: (evt, gestureState) =>
      pan.setValue({ x: gestureState.dx, y: 0 }),
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 75) {
        // Handle swipe to the right (previous chapter)
        // Swipe to the right, display the previous chapter
        previousChapter();
      } else if (gestureState.dx < -75) {
        // Handle swipe to the left (next chapter)
        nextChapter();
      } else {
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <ScrollView style={styles.scroll} {...panResponder.panHandlers}>
      <Animated.View
        style={{ transform: [{ translateX: pan.x }] }}
        {...panResponder.panHandlers}
      >
        <View style={styles.container}>
          <Text style={styles.header}>
            {book} {chapter}
          </Text>
          <Text style={styles.text}>
            {data?.chapter.map((verse) => (
              <Text key={verse.verse_nr}>{verse.verse}</Text>
            ))}
          </Text>
        </View>
      </Animated.View>
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
    paddingTop: 124,
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

export default BibleScreen;
