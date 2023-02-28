import { Ionicons } from "@expo/vector-icons";
import { Container } from "@src/components/Container";
import { Loading } from "@src/components/Loading";
import { API_URL, BIBLE_BOOKS } from "@src/constants";
import { useApi } from "@src/hooks/useApi";
import colors from "@src/styles/colors";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IVerse {
  verse_nr: number;
  verse: string;
}

// TODO: Add buttons for previous and next chapter, as well as table of contents
const BibleScreen = () => {
  const [book, setBook] = useState<string>("Genesis");
  const [chapter, setChapter] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);

  console.debug("*** BibleScreen ***")
  console.debug("book: ", book)
  console.debug("chapter: ", chapter)
  console.debug("error: ", error)
  console.debug("showToc: ", showToc)

  const nextChapter = () => {
    console.debug("nextChapter")
    const currentBook = BIBLE_BOOKS[book];
    console.debug("currentBook: ", currentBook)
    if (chapter < currentBook.chapters) {
      setChapter(chapter + 1);
    } else {
      const nextBook = currentBook.nextBook;
      if (nextBook) {
        setBook(nextBook);
        setChapter(1);
      }
    }
  };

  const previousChapter = () => {
    console.debug("previousChapter")
    const currentBook = BIBLE_BOOKS[book];
    console.debug("currentBook: ", currentBook)
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else {
      const prevBook = currentBook.prevBook;
      if (prevBook) {
        setBook(prevBook);
        setChapter(BIBLE_BOOKS[prevBook].chapters);
      }
    }
  };

  // This cloud function isn't deployed yet.
  const {
    isLoading,
    data,
    fetchData: getBibleChapter,
  } = useApi<{ chapter: IVerse[] }>(
    `${API_URL}/fetchChapter?book=${book}&chapter=${chapter}`
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

  function goToBook(book: string) {
    setBook(book);
    setChapter(1);
    setShowToc(false);
  }

  if (isLoading) {
    return <Loading />;
  }

  // TODO: Refactor into separate stack nav screens
  return (
    <Container>
      {showToc ? (
        <View className="flex-1 justify-center items-center py-4 px-6 bg-ffPaper">
          <View className="flex flex-row justify-between items-center py-4 px-6 bg-ffPaper">
            <TouchableOpacity
              onPress={() => setShowToc(false)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Ionicons name="ios-arrow-back" size={28} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.header} className="font-bold text-xl">
              Table of Contents
            </Text>
          </View>
          <ScrollView style={[styles.scroll, { width: "100%" }]}>
            <View className="bg-ffPaper">
              {Object.keys(BIBLE_BOOKS).map((book) => (
                <TouchableOpacity key={book} onPress={() => goToBook(book)}>
                  <Text className="text-xl">
                    {book}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <>
          <View className="flex flex-row justify-between items-center py-4 px-6 bg-ffPaper">
            <TouchableOpacity
              onPress={previousChapter}
              className="text-gray-700 hover:text-gray-900"
            >
              <Ionicons name="ios-arrow-back" size={28} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowToc(true)}>
              <Text style={styles.header} className="font-bold text-xl">
                {book} {chapter}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextChapter}
              className="text-gray-700 hover:text-gray-900"
            >
              <Ionicons
                name="ios-arrow-forward"
                size={28}
                color={colors.black}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            <View className="flex-1 justify-center items-center bg-ffPaper">
              <Text style={styles.text}>
                {data?.chapter.map((verse) => (
                  <Text key={verse.verse_nr}>{verse.verse}</Text>
                ))}
              </Text>
            </View>
          </ScrollView>
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.paper,
    flex: 1,
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
    fontFamily: "Baskerville",
  },
  verseNumber: {
    fontSize: 14,
  },
});

export default BibleScreen;
