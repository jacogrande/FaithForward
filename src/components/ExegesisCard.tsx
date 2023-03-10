import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { logShareExegesis } from "@src/analytics";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import SmallText from "@src/components/ui/SmallText";
import colors from "@src/styles/colors";
import { TExegesis } from "@src/types";
import { formatDate, truncateString } from "@src/utils";
import React, { useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export function ExegesisCard({
  exegesis,
  faves,
  handleFavoritingExegesis,
  handleUnfavoritingExegesis,
  initExpanded,
}: {
  exegesis: TExegesis;
  faves: string[];
  handleFavoritingExegesis: ((exegesis: TExegesis) => void) | null;
  handleUnfavoritingExegesis: (exegesis: TExegesis) => void;
  initExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(initExpanded || false);

  const shareExegesis = async () => {
    try {
      let shareAction;
      // Build message differently for general exegeses vs verse exegeses
      if (exegesis.type === "general") {
        shareAction = await Share.share({
          message: `"${exegesis.input}"

${exegesis.response}


Sent with Faith Forward`,
        });
      } else {
        shareAction = await Share.share({
          message: `"${exegesis.verse}"
- ${exegesis.book} ${exegesis.chapter}:${exegesis.verseNumber}

${exegesis.response}


Sent with Faith Forward`,
        });
      }

      logShareExegesis(
        exegesis.id,
        exegesis.book || "",
        exegesis.chapter || 0,
        exegesis.verseNumber || 0,
        exegesis.type || "unknown",
        shareAction.action
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const unfavoriteExegesis = () => {
    handleUnfavoritingExegesis(exegesis);
  };

  const favoriteExegesis = () => {
    handleFavoritingExegesis && handleFavoritingExegesis(exegesis);
  };

  return (
    <View
      style={{
        borderRadius: 12,
        padding: 24,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 2,
      }}
    >
      <TouchableOpacity onPress={toggleExpansion}>
        <ExegesisTitle exegesis={exegesis} />
        {!isExpanded && (
          <View>
            <BaseText>{truncateString(exegesis.response, 140)}</BaseText>
          </View>
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View>
          <BaseText>{exegesis.response}</BaseText>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome name="calendar-o" size={20} color="#999" />
          <SmallText className="pl-2">
            {formatDate(exegesis.createdAt)}
          </SmallText>
        </View>
        <View style={{ flexDirection: "row" }}>
          {faves.includes(exegesis.id) ? (
            <TouchableOpacity
              onPress={unfavoriteExegesis}
              style={{ paddingRight: 20 }}
            >
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={favoriteExegesis}
              style={{ paddingRight: 20 }}
            >
              <Ionicons name="heart-outline" size={24} color={colors.red} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={shareExegesis}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ExegesisTitle({ exegesis }: { exegesis: TExegesis }) {
  const title =
    exegesis.type === "general"
      ? exegesis.input
      : `${formatVerse(exegesis.verse || "")}
- ${exegesis.book} ${exegesis.chapter}:${exegesis.verseNumber}`;

  return (
    <BigText style={styles.highlight} className="mb-2">
      {title}
    </BigText>
  );
}

function formatVerse(verse: string): string {
  // Trim whitespace
  verse = verse.trim();

  // Add quotes if they are not present
  if (verse[0] !== '"') {
    verse = `"${verse}`;
  }
  if (verse[verse.length - 1] !== '"') {
    verse = `${verse}"`;
  }

  return verse;
}

const styles = StyleSheet.create({
  highlight: {
    fontWeight: "600",
    fontFamily: "Baskerville",
  },
  text: {
    fontSize: 16,
    padding: 8,
    color: "#333",
    lineHeight: 28,
  },
});
