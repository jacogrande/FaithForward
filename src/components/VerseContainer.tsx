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
import useStore from "../store";
import colors from "../styles/colors";

const VerseContainer: React.FC<{ verse: any; isLoading: boolean }> = ({
  verse,
  isLoading,
}) => {
  const verseRef = useRef<ViewShot | null>(null);
  const input = useStore((state) => state.input);
  const [sharing, setSharing] = useState<boolean>(false);

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
    verse.response = verse.response.replace(/“|”/g, '"');
    const quotes: string[] = verse.response.split(/(".*?")/);
    let formattedVerse: (string | JSX.Element)[] = [];
    if (quotes.length >= 1) {
      formattedVerse = quotes.map((quote, i) => {
        if (i % 2 === 1) {
          return (
            <Text style={styles.highlight} key={quote}>
              {quote}
            </Text>
          );
        }
        return quote;
      });
    }
    if (formattedVerse.length > 0) return formattedVerse;
    return verse.response;
  };

  return (
    <View style={styles.verse}>
      <ScrollView style={{ paddingTop: 24, backgroundColor: colors.paper }}>
        {verse && verse.response && (
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
        {isLoading && (
          <ActivityIndicator
            color={colors.blue}
            size={"large"}
            style={{ marginTop: 48 }}
          />
        )}
      </ScrollView>
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
    paddingHorizontal: 36,
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
