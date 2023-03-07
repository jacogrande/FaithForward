import { useNavigation } from "@react-navigation/native";
import { logShareDevotional } from "@src/analytics";
import { formatVerse } from "@src/components/DevotionalCard";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import { getVerseRef, getVerseRefs } from "@src/utils";
import { useRef } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

function VerseContainer() {
  const navigation = useNavigation<any>();
  let devotional = useStore((state) => state.devotional);
  const { setBook, setChapter, setVerseNumber, setVerse } = useBibleStore();
  const verseRef = useRef<ViewShot | null>(null);
  const { input } = useStore();

  const handleVersePress = (pressedVerse: string) => {
    const verseRef = getVerseRef(pressedVerse, devotional);
    const fullVerse = `${pressedVerse} (${verseRef})`;
    const { book, chapter, verseNum } = getVerseRefs(fullVerse || "");

    if (book === "" || chapter === 0 || verseNum === 0) {
      console.warn("Invalid verse reference");
      return;
    }

    setBook(book);
    setChapter(chapter);
    setVerseNumber(verseNum);
    setVerse(pressedVerse);

    navigation.navigate("Bible", {
      screen: "ReaderAndStudy",
      params: {
        screen: "Reader",
        params: {
          book,
          chapter
        }
      },
    })
  };

  async function handleShare() {
    if (!verseRef.current || !verseRef.current.capture) return;
    try {
      const imageUri = await verseRef.current.capture();
      const shareAction = await Share.share({
        url: imageUri,
      });
      logShareDevotional("", "Personal Devotional", shareAction.action);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.verse}>
      <ScrollView style={{ paddingTop: 24, backgroundColor: colors.paper }}>
        {devotional && (
          <View style={{ alignItems: "center" }}>
            <View
              style={{ alignItems: "center", backgroundColor: colors.paper }}
            >
              <Text style={styles.response}>
                {formatVerse(devotional, handleVersePress)}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleShare}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <ViewShot ref={verseRef} style={styles.screenshot}>
              <Text style={styles.prompt}>
                <Text style={styles.bold}>Me: </Text>
                {input}
              </Text>
              <Text style={styles.response}>
                <Text style={styles.bold}>Faith Forward: </Text>
                {formatVerse(devotional, handleVersePress)}
              </Text>
            </ViewShot>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  response: {
    fontSize: 16,
    paddingHorizontal: "10%",
    paddingBottom: 36,
    paddingTop: 8,
    color: "#333",
    lineHeight: 28,
  },
  verse: {
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  button: {
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 12,
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "bold",
  },
  prompt: {
    fontSize: 16,
    color: "#333",
    marginTop: 24,
    paddingHorizontal: "10%",
  },

  bold: {
    fontWeight: "700",
    color: "#111",
  },

  screenshot: {
    position: "absolute",
    top: -100000,
    left: 0,
    zIndex: -2,
    alignItems: "flex-start",
    backgroundColor: colors.paper,
  },
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
  },
});

export default VerseContainer;
