import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import useStore from "../Store";
import colors from "../styles/colors";
import LoadingMessages from "./LoadingMessages";
import VerseActionModal from "./VerseActionModal";

const getVerseRef = (verse: string, fullResponse: string) => {
  // insert spaces after each opening parenthesis and before each closing parenthesis
  const match = new RegExp(
    /(?:\b\d+ )?[a-z]+ ?\d+(?:(?::\d+)?(?: ?- ?(?:\d+ [a-z]+ )?\d+(?::\d+)?)?)?(?=\b)/i
  );
  // check the characters around the pressed verse to try and find the verse reference
  const verseIndex = fullResponse.indexOf(verse);
  const startIndex = verseIndex - 100;
  const surroundingText = fullResponse.slice(
    startIndex > 0 ? startIndex : 0,
    verseIndex + verse.length + 50
  );
  const reference = surroundingText.match(match);
  if (reference?.toString().toLowerCase().substring(0, 2) === "in") {
    // cut the full response from the "in" to the end
    const newResponse = fullResponse.slice(
      fullResponse.indexOf(reference?.toString()) + 2,
      fullResponse.length
    );
    // find the next verse reference
    const newReference = newResponse.match(match);
    // console.log(newReference);
    return newReference?.toString();
  }
  return reference?.toString();
};

const VerseContainer: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  let devotional = useStore((state) => state.devotional);
  const verseRef = useRef<ViewShot | null>(null);
  const { input, selectedVerse, setSelectedVerse } = useStore();
  const [sharing, setSharing] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleVersePress = (pressedVerse: string) => {
    const verseRef = getVerseRef(pressedVerse, devotional);
    setSelectedVerse(`${pressedVerse} (${verseRef})`);
    setModalOpen(true);
  };

  const closeVerseModal = () => setModalOpen(false);

  const share = async () => {
    setSharing(true);
  };

  useEffect(() => {
    if (sharing) {
      const asyncShare = async () => {
        if (!verseRef.current || !verseRef.current.capture) return;
        try {
          const imageUri = await verseRef.current.capture();
          await Share.share({
            url: imageUri,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setSharing(false);
        }
      };
      setTimeout(() => {
        asyncShare();
      }, 100);
    }
  }, [sharing]);

  const formatVerse = () => {
    // convert all quotation marks to double quotes
    devotional = devotional.replace(/“|”/g, '"');
    // handle the edge case where the entire response is wrapped in quotes
    if (devotional[0] === `"` && devotional[devotional.length - 1] === `"`) {
      devotional = devotional.slice(1, devotional.length - 1);
      devotional = devotional.replace(/'/g, '"');
    }
    const quotes: string[] = devotional.split(/(".*?")/);
    let formattedVerse: (string | JSX.Element)[] = [];
    if (quotes.length >= 1) {
      formattedVerse = quotes.map((quote, i) => {
        // non verse text
        if (i % 2 === 0) return quote;
        // style all biblical quotes
        const verseRef = getVerseRef(quote, devotional);
        if (verseRef)
          return (
            <Text
              style={styles.highlight}
              key={quote}
              onPress={() => handleVersePress(quote)}
              accessibilityHint="Tap to open the verse action menu."
            >
              {quote}
            </Text>
          );
        // return non biblical quotes normally
        return quote;
      });
    }
    if (formattedVerse.length > 0) return formattedVerse;
    return devotional;
  };

  return (
    <View style={styles.verse}>
      <ScrollView style={{ paddingTop: 24, backgroundColor: colors.paper }}>
        {devotional && (
          <View style={{ alignItems: "center" }}>
            <View
              style={{ alignItems: "center", backgroundColor: colors.paper }}
            >
              <Text style={styles.response}>{formatVerse()}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={share}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <ViewShot ref={verseRef} style={styles.screenshot}>
              <Text style={styles.prompt}>
                <Text style={styles.bold}>Me: </Text>
                {input}
              </Text>
              <Text style={styles.response}>
                <Text style={styles.bold}>Faith Forward: </Text>
                {formatVerse()}
              </Text>
            </ViewShot>
          </View>
        )}
        {isLoading && <LoadingMessages />}
      </ScrollView>
      <VerseActionModal
        isModalVisible={modalOpen}
        verse={selectedVerse}
        onClose={closeVerseModal}
      />
    </View>
  );
};

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
