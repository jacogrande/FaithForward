import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  logFavoriteVerse,
  logGetExegesis,
  logShareVerse,
  logUnfavoriteVerse,
  logViewBibleChapter,
} from "@src/analytics";
import { ExegesisLoadingMessage } from "@src/components/ExegesisLoadingMessage";
import { Loading } from "@src/components/Loading";
import BigText from "@src/components/ui/BigText";
import { Container } from "@src/components/ui/Container";
import { API_URL, BIBLE_BOOKS } from "@src/constants";
import { auth, favoriteVerse, unfavoriteVerse } from "@src/firebase";
import { useBibleChapter } from "@src/hooks/useBibleChapter";
import { useFavorites } from "@src/hooks/useFavorites";
import { useRequestReview } from "@src/hooks/useRequestReview";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const BibleScreen = ({ route }: { route: any }) => {
  const [initialBook, setInitialBook] = useState<string | null>(null);
  const [initialChapter, setInitialChapter] = useState<number | null>(null);
  const [book, setBook] = useState<string | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [showToc, setShowToc] = useState<boolean | null>(null);

  const [showChapterSelection, setShowChapterSelection] = useState<
    string | null
  >(null);
  const { isLoading, data } = useBibleChapter(book, chapter);
  const scrollViewRef = useRef<ScrollView>(null);
  const tocScrollViewRef = useRef<ScrollView>(null);
  const { requestReview } = useRequestReview();

  useEffect(() => {
    const initializeBookAndChapter = async () => {
      if (route.params?.book) {
        setInitialBook(route.params.book);
        if (route.params?.chapter) {
          setInitialChapter(route.params.chapter);
        } else {
          setInitialChapter(1);
        }
        setShowToc(false);
      } else {
        const currentBook = await AsyncStorage.getItem("currentBook");
        if (currentBook) {
          setInitialBook(currentBook);
          const currentChapter = await AsyncStorage.getItem("currentChapter");
          if (currentChapter) {
            setInitialChapter(parseInt(currentChapter));
          } else {
            setInitialChapter(1);
          }
          setShowToc(false);
        } else {
          setInitialBook(null);
          setInitialChapter(null);
          setShowToc(true);
        }
      }
    };

    initializeBookAndChapter();
  }, [route.params]);

  useEffect(() => {
    if (initialBook && initialChapter) {
      setBook(initialBook);
      setChapter(initialChapter);
    }
  }, [initialBook, initialChapter]);

  useEffect(() => {
    if (book && chapter) {
      logViewBibleChapter(book, chapter);
      // Reset scroll view
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      // Save current book and chapter in local storage
      AsyncStorage.setItem("currentBook", book);
      AsyncStorage.setItem("currentChapter", chapter.toString());
    }
  }, [book, chapter, scrollViewRef.current]);

  const nextChapter = () => {
    if (!book || !chapter) return;

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
    requestReview();
  };

  const previousChapter = () => {
    if (!book || !chapter) return;

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
    requestReview();
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
              tocScrollViewRef.current?.scrollTo({
                x: 0,
                y: 0,
                animated: true,
              });
              setShowChapterSelection(null);
              requestReview();
            }}
            className="flex items-center justify-center mt-4 bg-ffDarkPaper rounded"
            style={{
              width: chapterButtonWidth,
              height: chapterButtonWidth,
              marginRight: i === group.length - 1 ? 0 : buttonMargin,
            }}
          >
            <BigText>{chapter + 1}</BigText>
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
              onPress={() => {
                setShowToc(false);
                tocScrollViewRef.current?.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              }}
              className="text-gray-700"
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
            ref={tocScrollViewRef}
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
                    <BigText
                      className={`text-ffText font-${
                        showChapterSelection === book ? "bold" : "medium"
                      } pr-2`}
                    >
                      {book}
                    </BigText>
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
              onPress={() => {
                setShowToc(true);
                scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
                tocScrollViewRef.current?.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              }}
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

          <ScrollView ref={scrollViewRef} style={styles.scroll}>
            <View className="flex-1 justify-center items-center bg-ffPaper">
              {book && chapter ? (
                <Chapter book={book} chapter={chapter} verses={data} />
              ) : (
                <Text className="text-ffText text-center mt-4">
                  No chapter selected
                </Text>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </Container>
  );
};

const Chapter = ({
  book,
  chapter,
  verses,
}: {
  book: string;
  chapter: number;
  verses: string[];
}) => {
  const navigation = useNavigation<any>();
  const {
    setBook: setStoredBook,
    setChapter: setStoredChapter,
    setVerse: setStoredVerse,
    setVerseNumber: setStoredVerseNumber,
    setExegesis,
  } = useBibleStore();
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [isLoadingExegesis, setIsLoadingExegesis] = useState(false);
  const { setError } = useStore();
  const { favorites, setQuietlyRefreshing } = useFavorites({
    fetch: true,
    faveType: "verses",
  });
  const [favoriteVerses, setFavoriteVerses] = useState<number[]>([]);

  useEffect(() => {
    const faveVerses =
      favorites?.filter(
        (fave) =>
          fave.type === "verse" &&
          fave.docData.book === book &&
          fave.docData.chapter === chapter
      ) || [];
    // use lodash throttle to throttle calls to setFavoriteVerses
    // so it doesn't run on every render
    throttle(() => {
      setFavoriteVerses(faveVerses.map((fave) => fave.docData.verseNumber));
    }, 1000);
  }, [JSON.stringify(favorites)]);

  const faveVerses = async () => {
    try {
      // update favoriteVerses state to include all verses in selectedVerses, deduped
      setFavoriteVerses([...new Set([...favoriteVerses, ...selectedVerses])]);
      // Filter selectedVerses for ones that are not favorited
      // Because sometimes a selected range will include verses that are already favorited
      const versesToFavorite = selectedVerses.filter(
        (verse) => !favoriteVerses.includes(verse)
      );
      // logFavoriteVerse for each selectedVerse
      // favoriteVerse for each selectedVerse
      versesToFavorite.forEach(async (verse) => {
        logFavoriteVerse(book, chapter, verse);
        await favoriteVerse("kjv", book, chapter, verse, verses[verse - 1]);
      });
    } catch (err: any) {
      console.warn("Error favoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
    }
  };

  const unfaveVerses = async () => {
    try {
      // update favoriteVerses state to omit all verses in selectedVerses
      setFavoriteVerses(
        favoriteVerses.filter((fave) => !selectedVerses.includes(fave))
      );
      // Filter selectedVerses for ones that are favorited
      // Because sometimes a selected range will include verses that are not favorited
      const versesToUnfavorite = selectedVerses.filter((verse) =>
        favoriteVerses.includes(verse)
      );
      // logUnfavoriteVerse for each selectedVerse
      // unfavoriteVerse for each selectedVerse
      versesToUnfavorite.forEach(async (verse) => {
        logUnfavoriteVerse(book, chapter, verse);
        await unfavoriteVerse("kjv", book, chapter, verse);
      });
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
    }
  };

  const handleFaveToggle = () => {
    // Base it on the fave state of the highest selected verse number
    const highestSelectedVerse = selectedVerses[selectedVerses.length - 1];
    const isFaved = favoriteVerses.some(
      (fave) => fave === highestSelectedVerse
    );
    if (isFaved) {
      unfaveVerses();
    } else {
      faveVerses();
    }
  };

  // Update selectedVerses array
  // - first, last, or only verse in the array? remove
  // - middle verse in a range? remove everything but
  // - verse not in or neighboring range? add, and remove all others
  // - otherwise, add
  const handleVersePress = (verseNumber: number) => {
    // No verses selected? Select the pressed verse
    if (selectedVerses.length === 0) {
      setSelectedVerses([verseNumber]);
      return;
    }

    // Only one verse is selected, and it's the pressed verse? Deselect it
    if (selectedVerses.length === 1 && selectedVerses[0] === verseNumber) {
      setSelectedVerses([]);
      return;
    }

    // Only one verse is selected, and it's not the pressed verse?
    // If it's +/- 1 from the pressed verse, select the range
    // Otherwise, select the pressed verse
    if (selectedVerses.length === 1) {
      const selectedVerse = selectedVerses[0];
      if (
        verseNumber === selectedVerse + 1 ||
        verseNumber === selectedVerse - 1
      ) {
        setSelectedVerses([selectedVerse, verseNumber].sort());
      } else {
        setSelectedVerses([verseNumber]);
      }
      return;
    }

    // Multiple verses are selected
    // Check if the pressed verse is +/- 1 from the first or last selected verse
    // or if it is the first or last selected verse
    // If so, update the range
    // If not, select the pressed verse
    const firstSelectedVerse = selectedVerses[0];
    const lastSelectedVerse = selectedVerses[selectedVerses.length - 1];
    if (
      verseNumber === firstSelectedVerse - 1 ||
      verseNumber === lastSelectedVerse + 1 ||
      verseNumber === firstSelectedVerse ||
      verseNumber === lastSelectedVerse
    ) {
      const newSelectedVerses = [...selectedVerses];
      if (verseNumber === firstSelectedVerse) {
        newSelectedVerses.shift();
      } else if (verseNumber === lastSelectedVerse) {
        newSelectedVerses.pop();
      } else {
        newSelectedVerses.push(verseNumber);
      }
      setSelectedVerses(newSelectedVerses.sort());
    } else {
      setSelectedVerses([verseNumber]);
    }
  };

  const handleSharePress = async () => {
    try {
      const versesText = selectedVerses
        .map((verse) => verses[verse - 1])
        .join(" ");
      const verseNumberText =
        selectedVerses.length > 1
          ? `${selectedVerses[0]}-${selectedVerses[selectedVerses.length - 1]}`
          : selectedVerses[0];
      const shareAction = await Share.share({
        message: `"${versesText}"
- ${book} ${chapter}:${verseNumberText}

Sent with Faith Forward`,
      });
      logShareVerse(book, chapter, selectedVerses[0], shareAction.action);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleExegesisPress = async () => {
    try {
      const selectedVerseNumber = selectedVerses[selectedVerses.length - 1];
      const selectedVerseTexts = verses
        .filter((_verse, index) => selectedVerses.includes(index + 1))
        .join(" ");
      setIsLoadingExegesis(true);
      logGetExegesis(book, chapter, selectedVerseNumber, "verse");

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
          verseNumber: `${selectedVerses[0]}-${
            selectedVerses[selectedVerses.length - 1]
          }`,
          verse: selectedVerseTexts,
        }),
      });

      const data = await response.json();

      setStoredBook(book);
      setStoredChapter(chapter);
      setStoredVerseNumber(selectedVerseNumber);
      setStoredVerse(selectedVerseTexts);
      setExegesis(data.response);

      navigation.navigate("Verse Analysis", {});
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingExegesis(false);
    }
  };

  if (!verses) {
    return <></>;
  }

  const keyExtractor = (index: number) => `${book} ${chapter}:${index}`;

  return (
    <View style={styles.container}>
      {verses.map((verse: string, index: number) => (
        <Verse
          key={keyExtractor(index)}
          verse={verse}
          num={index + 1}
          // Only show as favorited if every selected verse is favorited
          favorited={selectedVerses.every((verse) =>
            favoriteVerses.includes(verse)
          )}
          onFaveToggle={handleFaveToggle}
          showActions={index + 1 === selectedVerses[selectedVerses.length - 1]}
          isSelected={selectedVerses.includes(index + 1)}
          onVersePress={() => handleVersePress(index + 1)}
          onSharePress={handleSharePress}
          onExegesisPress={handleExegesisPress}
          isLoadingExegesis={isLoadingExegesis}
        />
      ))}
    </View>
  );
};

const Verse = ({
  verse,
  num,
  favorited,
  onFaveToggle,
  showActions,
  isSelected,
  onVersePress,
  onSharePress,
  onExegesisPress,
  isLoadingExegesis,
}: {
  verse: string;
  num: number;
  favorited: boolean;
  onFaveToggle: () => void;
  showActions: boolean;
  isSelected: boolean;
  onVersePress: () => void;
  onSharePress: () => void;
  onExegesisPress: () => void;
  isLoadingExegesis: boolean;
}) => {
  return (
    <TouchableOpacity onPress={onVersePress}>
      <View style={styles.verseContainer}>
        <Text style={styles.verseNum}>{num}</Text>
        <Text style={[styles.verseText, isSelected ? styles.highlight : {}]}>
          {verse}
        </Text>
      </View>
      {showActions && (
        <>
          <View
            className={`${isLoadingExegesis ? "mb-2" : "mb-5"}`}
            style={styles.actionsContainer}
          >
            {favorited ? (
              <TouchableOpacity
                onPress={onFaveToggle}
                style={styles.actionButton}
              >
                <Ionicons name="heart-sharp" size={24} color={colors.red} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onFaveToggle}
                style={styles.actionButton}
              >
                <Ionicons name="heart-outline" size={24} color={colors.red} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onSharePress}
              style={styles.actionButton}
            >
              <Feather name="share" size={20} color={colors.blue} />
            </TouchableOpacity>
            {isLoadingExegesis ? (
              <View style={styles.actionButton}>
                <ActivityIndicator size="small" color={colors.blue} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={onExegesisPress}
                style={styles.actionButton}
              >
                <FontAwesome5 name="scroll" size={20} color={colors.blue} />
              </TouchableOpacity>
            )}
          </View>
          {isLoadingExegesis && (
            <View style={{ marginHorizontal: "12%" }}>
              <ExegesisLoadingMessage />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

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
    paddingHorizontal: 5,
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
