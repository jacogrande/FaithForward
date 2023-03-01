import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { logViewBibleChapter } from "@src/analytics";
import { Container } from "@src/components/Container";
import { Loading } from "@src/components/Loading";
import { BIBLE_BOOKS } from "@src/constants";
import { useBibleChapter } from "@src/hooks/useBibleChapter";
import colors from "@src/styles/colors";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "@src/store";

const BibleScreen = () => {
  const selectedVerse = useStore((state) => state.selectedVerse);

  const [book, setBook] = useState<string>(
    selectedVerse ? getBookAndChapter(selectedVerse).book : "Genesis"
  );
  const [chapter, setChapter] = useState(
    selectedVerse ? parseInt(getBookAndChapter(selectedVerse).chapter) : 1
  );
  const [showToc, setShowToc] = useState(false);
  const [showChapterSelection, setShowChapterSelection] = useState<
    string | null
  >(null);
  const { isLoading, data } = useBibleChapter(book, chapter);

  // Extract book and chapter from selectedVerse, which is formatted like "verse" (book chapter:versenum)
  function getBookAndChapter(verse: string) {
    const splits = verse.split("(");
    const reference = splits[splits.length - 1].replace(")", "");
    const [book, chapterAndVerse] = reference.split(" ");
    const chapter = chapterAndVerse.split(":")[0];
    return { book, chapter };
  }

  useEffect(() => {
    if (book && chapter) {
      logViewBibleChapter(book, chapter);
    }
  }, [book, chapter]);

  useEffect(() => {
    if (selectedVerse) {
      const { book, chapter } = getBookAndChapter(selectedVerse);
      setBook(book);
      setChapter(parseInt(chapter));
      /* setSelectedVerse(null) */
    }
  }, [selectedVerse])

  const nextChapter = () => {
    const currentBook = BIBLE_BOOKS[book];
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
    const currentBook = BIBLE_BOOKS[book];
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

  // Adds verse numbers to the chapter
  // TODO: Extract, make more robust
  const Chapter = () => {
    if (!data) {
      return <></>;
    }

    return (
      <View style={styles.container}>
        {data.map((verse: string, index: number) => (
          <View style={styles.verseContainer} key={index}>
            <Text style={styles.verseNum}>{index + 1}</Text>
            <Text style={styles.verseText}>{verse}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  // TODO: Refactor into separate stack nav screens
  return (
    <Container>
      {showToc ? (
        <>
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
            <View />
          </View>
          <ScrollView style={[styles.scroll, { width: "100%" }]}>
            <View className="flex-1 px-6 mb-10 bg-ffPaper">
              {Object.keys(BIBLE_BOOKS).map((book) => (
                <View key={book}>
                  <TouchableOpacity
                    onPress={() =>
                      showChapterSelection === book
                        ? setShowChapterSelection(null)
                        : setShowChapterSelection(book)
                    }
                    className="flex flex-row items-center mt-4"
                  >
                    <Text
                      style={styles.header}
                      className="text-xl font-bold text-gray-900 pr-2"
                    >
                      {book}
                    </Text>
                    <FontAwesome5
                      name={
                        showChapterSelection === book
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color={colors.black}
                      className="ml-auto"
                    />
                  </TouchableOpacity>
                  {showChapterSelection === book && (
                    <View className="flex flex-row flex-wrap">
                      {Array.from(Array(BIBLE_BOOKS[book].chapters).keys()).map(
                        (chapter) => (
                          <TouchableOpacity
                            key={`${book} ${chapter}`}
                            onPress={() => {
                              setBook(book);
                              setChapter(chapter + 1);
                              setShowToc(false);
                              setShowChapterSelection(null);
                            }}
                            className="flex flex-row items-center mt-2 mr-2 px-2 py-1 bg-gray-200 rounded"
                          >
                            <Text
                              style={styles.header}
                              className="text-lg font-bold text-gray-900 pr-2"
                            >
                              {chapter + 1}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <View className="flex flex-row justify-between items-center py-4 px-6 bg-ffPaper">
            <TouchableOpacity
              onPress={previousChapter}
              className="text-gray-700 hover:text-gray-900"
            >
              <Ionicons name="ios-arrow-back" size={28} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowToc(true)}
              className="flex flex-row items-center"
            >
              <Text style={styles.header} className="font-bold text-xl pr-1">
                {book} {chapter}
              </Text>
              <FontAwesome5
                name="chevron-down"
                size={14}
                color={colors.black}
              />
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
              <Chapter />
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

  container: {
    flex: 1,
    width: "100%",
  },
  verseContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    marginHorizontal: "10%",
  },
  verseNum: {
    fontWeight: "bold",
    marginRight: 10,
    fontSize: 16,
    width: "8%",
    lineHeight: 28,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
  },
});

export default BibleScreen;
