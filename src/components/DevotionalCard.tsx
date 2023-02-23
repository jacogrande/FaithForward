import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Share, Text, TouchableOpacity, View } from "react-native";
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
  const { setError } = useStore();

  // TODO: Rework share to use personalized devo logic, i.e. attach a screenshot of the full convo
  async function shareDevo() {
    try {
      const result = await Share.share({
        message: `Check out this devotional from Faith Forward!

"${devotional.input}"

Faith Forward:
${devotional.response}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
    }
  }

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
          <TouchableOpacity onPress={shareDevo}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
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
