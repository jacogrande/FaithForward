import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ViewShot from "react-native-view-shot";
import { TTradDevo } from "../../types";
import useStore from "../Store";
import colors from "../styles/colors";
import { formatDate, getVerseRef } from "../utils";

export function DevotionalCard({
  devotional,
  isExpanded,
  onPress,
  faves,
  handleFavoritingDevo,
  handleUnfavoritingDevo,
}: {
  devotional: TTradDevo;
  isExpanded: boolean;
  onPress: () => void;
  faves: string[];
  handleFavoritingDevo: (devo: TTradDevo) => void;
  handleUnfavoritingDevo: (devo: TTradDevo) => void;
}) {
  const [isSharing, setIsSharing] = useState(false);
  const verseRef = useRef<ViewShot | null>(null);
  const { setError } = useStore();

  useEffect(() => {
    if (isSharing) {
      const asyncShare = async () => {
        if (!verseRef.current || !verseRef.current.capture) return;
        try {
          const imageUri = await verseRef.current.capture();
          await Share.share({
            url: imageUri,
          });
        } catch (err: any) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsSharing(false);
        }
      };
      setTimeout(() => {
        asyncShare();
      }, 100);
    }
  }, [isSharing]);

  return (
    <View
      style={{
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 4,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 2,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {devotional.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontStyle: "italic",
          }}
        >
          {devotional.input}
        </Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View style={{ alignItems: "center", backgroundColor: colors.paper }}>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 20,
                paddingBottom: 20,
                paddingTop: 8,
                color: "#333",
                lineHeight: 28,
              }}
            >
              {formatVerse(devotional.response, () => {})}
            </Text>
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="calendar-o" size={20} color="#999" />
          <Text style={{ fontSize: 14, color: "#999", paddingLeft: 10 }}>
            {formatDate(devotional.createdAt)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {faves.includes(devotional.id) ? (
            <TouchableOpacity
              onPress={() => handleUnfavoritingDevo(devotional)}
              style={{ paddingRight: 20 }}
            >
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleFavoritingDevo(devotional)}
              style={{ paddingRight: 20 }}
            >
              <Ionicons name="heart-outline" size={24} color={colors.red} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setIsSharing(true)}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
      <ViewShot ref={verseRef} style={styles.screenshot}>
        <Text style={styles.prompt}>
          {devotional.input}
        </Text>
        <Text style={styles.response}>
          <Text style={styles.bold}>Faith Forward: </Text>
          {formatVerse(devotional.response, () => {})}
        </Text>
      </ViewShot>
    </View>
  );
}

export const formatVerse = (
  devotional: string,
  onVersePress: (quote: string) => void
) => {
  if (!devotional) return null;
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
            style={{
              backgroundColor: "#fff3a8",
              fontWeight: "600",
              fontFamily: "Baskerville",
            }}
            key={quote}
            onPress={() => onVersePress(quote)}
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

const styles = StyleSheet.create({
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
  response: {
    fontSize: 16,
    paddingHorizontal: "10%",
    paddingBottom: 36,
    paddingTop: 8,
    color: "#333",
    lineHeight: 28,
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