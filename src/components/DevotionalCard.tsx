import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logShareDevotional, logViewDevotional } from "@src/analytics";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import { formatDate, getVerseRef, getVerseRefs } from "@src/utils";
import React, { useRef, useState } from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ViewShot from "react-native-view-shot";
import BaseText from "./ui/BaseText";
import BigText from "./ui/BigText";
import Quote from "./ui/Quote";
import SmallText from "./ui/SmallText";

export function DevotionalCard({
  devotional,
  faves,
  handleFavoritingDevo,
  handleUnfavoritingDevo,
  initExpanded,
}: {
  devotional: any;
  faves: string[];
  handleFavoritingDevo: (devo: any) => void;
  handleUnfavoritingDevo: (devo: any) => void;
  initExpanded?: boolean;
}) {
  const navigation = useNavigation<any>();
  const [isExpanded, setIsExpanded] = useState(initExpanded || false);
  const verseRef = useRef<ViewShot | null>(null);
  const { setError } = useStore();

  async function handleShare() {
    if (!verseRef.current || !verseRef.current.capture) return;
    try {
      const imageUri = await verseRef.current.capture();
      const shareAction = await Share.share({
        url: imageUri,
      });
      logShareDevotional(devotional.id, devotional.title, shareAction.action);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  }

  function handleExpandingDevo() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
      logViewDevotional(
        devotional.id,
        devotional.title || "Personal Devotional"
      );
    }
  }

  function goToVerse(book: string, chapter: number) {
    navigation.navigate("Reader", {
      book,
      chapter,
    });
  }

  return (
    <View
      style={{
        borderRadius: 12,
        padding: 24,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 2,
      }}
    >
      <TouchableOpacity onPress={handleExpandingDevo}>
        {!!devotional.title && (
          <BigText className="mb-2">{devotional.title}</BigText>
        )}
        <BaseText className="italic">{devotional.input}</BaseText>
      </TouchableOpacity>
      {isExpanded && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View style={{ alignItems: "center", backgroundColor: colors.paper }}>
            <BaseText className="pb-4 pt-2">
              {formatVerse(devotional.response, goToVerse)}
            </BaseText>
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="calendar-o" size={20} color="#999" />
          <SmallText className="pl-2">
            {formatDate(devotional.createdAt)}
          </SmallText>
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
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
      <ViewShot ref={verseRef} style={styles.screenshot}>
        <BaseText className="italic">{devotional.input}</BaseText>
        <BaseText className="pb-4 pt-2">
          <Text style={styles.bold}>Faith Forward: </Text>
          {formatVerse(devotional.response, () => {})}
        </BaseText>
      </ViewShot>
    </View>
  );
}

export const formatVerse = (
  devotional: string,
  onVersePress: (book: string, chapter: number) => void
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
      const fullVerse = `${quote} (${verseRef})`;
      const { book, chapter } = getVerseRefs(fullVerse || "");

      if (verseRef) {
        // Generate random key
        const key = Math.random().toString(36).substring(7);
        return (
          <Quote
            key={key}
            onPress={() => onVersePress(book, chapter)}
            accessibilityHint="Tap to open the verse action menu."
          >
            {quote}
          </Quote>
        );
      }

      // return non biblical quotes normally
      return quote;
    });
  }
  if (formattedVerse.length > 0) return formattedVerse;
  return devotional;
};

const styles = StyleSheet.create({
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
});
