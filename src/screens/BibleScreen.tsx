import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  logFavoriteVerse,
  logGetExegesis,
  logShareVerse,
  logUnfavoriteVerse,
  logViewBibleChapter,
} from "@src/analytics";
import { Container } from "@src/components/Container";
import { ExegesisLoadingMessage } from "@src/components/ExegesisLoadingMessage";
import { Loading } from "@src/components/Loading";
import { API_URL, BIBLE_BOOKS } from "@src/constants";
import { auth, favoriteVerse, unfavoriteVerse } from "@src/firebase";
import { useBibleChapter } from "@src/hooks/useBibleChapter";
import { useFavorites } from "@src/hooks/useFavorites";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BibleScreen = ({ route }: { route: any }) => {
  const [book, setBook] = useState<string>(route.params?.book || "Genesis");
  const [chapter, setChapter] = useState(route.params?.chapter || 1);
  const [showToc, setShowToc] = useState(route.params?.book ? false : true);
  const [showChapterSelection, setShowChapterSelection] = useState<
    string | null
  >(null);
  const { isLoading, data } = useBibleChapter(book, chapter);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (book && chapter) {
      logViewBibleChapter(book, chapter);
      // Reset scroll view
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [book, chapter]);

  useEffect(() => {
    if (route.params?.book) {
      setBook(route.params.book);
    }
    if (route.params?.chapter) {
      setChapter(route.params.chapter);
    }
  }, [JSON.stringify(route.params)]);

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

  // width of the window minus the margins
  const containerWidth = Dimensions.get("window").width - 40;

  // width of the chapter buttons
  const chapterButtonWidth = containerWidth / 6;

  // width of each button margin
  const buttonMargin = containerWidth / 6 / 5;

  const getChapterButtons = (bookName: string) => {
    const chapters = Array.from(Array(BIBLE_BOOKS[bookName].chapters).keys());
    // split up the chapters into groups of 5
    const chapterGroups = [];
    for (let i = 0; i < chapters.length; i += 5) {
      chapterGroups.push(chapters.slice(i, i + 5));
    }
    // return a view row for each group
    return chapterGroups.map((group) => (
      <View key={group[0]} className="flex flex-row w-full">
        {group.map((chapter, i) => (
          <TouchableOpacity
            key={`${bookName} ${chapter}`}
            onPress={() => {
              setBook(bookName);
              setChapter(chapter + 1);
              setShowToc(false);
              setShowChapterSelection(null);
            }}
            className="flex items-center justify-center mt-4 bg-ffDarkPaper rounded"
            style={{
              width: chapterButtonWidth,
              height: chapterButtonWidth,
              marginRight: i === group.length - 1 ? 0 : buttonMargin,
            }}
          >
            <Text className="text-lg font-bold text-ffBlack">
              {chapter + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  if (isLoading) {
    return <Loading />;
  }

  // TODO: Refactor into separate stack nav screens
  // TODO: Refactor into subcomponents
  return (
    <Container>
      {showToc ? (
        <>
          <View className="flex flex-row justify-between items-center py-4 px-6 bg-ffPaper">
            <TouchableOpacity
              onPress={() => setShowToc(false)}
              className="text-gray-700 hover:text-gray-900 absolute left-[20px] z-10"
            >
              <Ionicons name="ios-arrow-back" size={28} color={colors.black} />
            </TouchableOpacity>
            <Text
              style={styles.header}
              className="text-xl text-center flex-1 text-ffBlack font-bold"
            >
              Table of Contents
            </Text>
            <View />
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={[styles.scroll, { width: "100%" }]}
          >
            {/* view with bottom border */}
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
                      className={`text-lg text-[#333] font-${
                        showChapterSelection === book ? "bold" : "medium"
                      } pr-2`}
                    >
                      {book}
                    </Text>
                    <FontAwesome5
                      name={
                        showChapterSelection === book
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={12}
                      color="#333"
                      className="ml-auto"
                    />
                  </TouchableOpacity>
                  {showChapterSelection === book && (
                    <View className="flex">{getChapterButtons(book)}</View>
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
              className="text-ffBlack hover:text-gray-900"
            >
              <Ionicons
                name="ios-arrow-back"
                size={28}
                color={
                  book === "Genesis" && chapter === 1
                    ? colors.paper
                    : colors.black
                }
              />
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
                size={12}
                color={colors.black}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextChapter}
              className="text-ffBlack hover:text-gray-900"
            >
              <Ionicons
                name="ios-arrow-forward"
                size={28}
                color={
                  book === "Revelation" && chapter === 22
                    ? colors.paper
                    : colors.black
                }
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            <View className="flex-1 justify-center items-center bg-ffPaper">
              <Chapter book={book} chapter={chapter} verses={data} />
            </View>
          </ScrollView>
        </>
      )}
    </Container>
  );
};

function Chapter({
  book,
  chapter,
  verses,
}: {
  book: string;
  chapter: number;
  verses: string[];
}) {
  const { favorites, setQuietlyRefreshing } = useFavorites("verses");
  const favoriteVerses = favorites.filter((fave) => fave.type === "verse");

  if (!verses) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      {verses.map((verse: string, index: number) => (
        <Verse
          key={index}
          book={book}
          chapter={chapter}
          verse={verse}
          num={index}
          favorited={favoriteVerses.some(
            (fave) =>
              fave.docData.book === book &&
              fave.docData.chapter === chapter &&
              fave.docData.verseNumber === index + 1
          )}
          onFaveToggle={() => setQuietlyRefreshing(true)}
        />
      ))}
    </View>
  );
}

function Verse({
  book,
  chapter,
  verse,
  num,
  favorited,
  onFaveToggle,
}: {
  book: string;
  chapter: number;
  verse: string;
  num: number;
  favorited: boolean;
  onFaveToggle: () => void;
}) {
  const navigation = useNavigation<any>();
  const { setBook, setChapter, setVerseNumber, setVerse, setExegesis } =
    useBibleStore();
  const { setError } = useStore();
  const [showActions, setShowActions] = useState(false);
  const [isLoadingExegesis, setIsLoadingExegesis] = useState(false);
  const [isFavorited, setIsFavorited] = useState(favorited);

  useEffect(() => {
    setIsFavorited(favorited);
  }, [favorited]);

  async function shareVerse() {
    try {
      const verseNumber = num + 1;
      const shareAction = await Share.share({
        message: `"${verse}"
- ${book} ${chapter}:${verseNumber}

Sent with Faith Forward`,
      });
      logShareVerse(book, chapter, verseNumber, shareAction.action);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleFavoritingVerse() {
    try {
      setIsFavorited(true);
      logFavoriteVerse(book, chapter, num + 1);
      await favoriteVerse("kjv", book, chapter, num + 1, verse);
    } catch (err: any) {
      console.warn("Error favoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      onFaveToggle();
    }
  }

  async function handleUnfavoritingVerse() {
    try {
      setIsFavorited(false);
      logUnfavoriteVerse(book, chapter, num + 1);
      await unfavoriteVerse("kjv", book, chapter, num + 1);
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      onFaveToggle();
    }
  }

  async function getExegesis() {
    try {
      setIsLoadingExegesis(true);
      logGetExegesis(book, chapter, num + 1, "verse");

      const userId = auth.currentUser?.uid;

      const response = await fetch(`${API_URL}/getExegesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          book,
          chapter,
          verseNumber: num + 1,
          verse: verse,
        }),
      });

      const data = await response.json();

      setBook(book);
      setChapter(chapter);
      setVerseNumber(num + 1);
      setVerse(verse);
      setExegesis(data.response);

      navigation.navigate("Exegesis", {});
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingExegesis(false);
    }
  }

  return (
    <TouchableOpacity onPress={() => setShowActions(!showActions)}>
      <View style={styles.verseContainer}>
        <Text style={styles.verseNum}>{num + 1}</Text>
        <Text style={styles.verseText}>{verse}</Text>
      </View>
      {showActions && (
        <>
          <View
            className={`${isLoadingExegesis ? "mb-2" : "mb-5"}`}
            style={styles.actionsContainer}
          >
            {isFavorited ? (
              <TouchableOpacity
                onPress={handleUnfavoritingVerse}
                style={styles.actionButton}
              >
                <Ionicons name="heart-sharp" size={24} color={colors.red} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFavoritingVerse}
                style={styles.actionButton}
              >
                <Ionicons name="heart-outline" size={24} color={colors.red} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={shareVerse} style={styles.actionButton}>
              <Feather name="share" size={20} color={colors.blue} />
            </TouchableOpacity>
            {isLoadingExegesis ? (
              <View style={styles.actionButton}>
                <ActivityIndicator size="small" color={colors.blue} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={getExegesis}
                style={styles.actionButton}
              >
                <FontAwesome5 name="scroll" size={20} color={colors.blue} />
              </TouchableOpacity>
            )}
          </View>
          {isLoadingExegesis && <ExegesisLoadingMessage />}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: "12%",
  },
  actionButton: {
    paddingHorizontal: 10,
  },

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
    color: colors.black,
  },
  verseNumber: {
    fontSize: 14,
  },

  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 40,
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
    color: colors.black,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
  },
});

export default BibleScreen;
