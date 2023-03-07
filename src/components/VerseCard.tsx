import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logShareVerse } from "@src/analytics";
import colors from "@src/styles/colors";
import React from "react";
import { Share, TouchableOpacity, View } from "react-native";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";

export function VerseCard({
  book,
  chapter,
  verseNumber,
  verse,
  handleUnfavoritingVerse,
}: {
  book: string;
  chapter: number;
  verseNumber: number;
  verse: string;
  handleUnfavoritingVerse: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => void;
}) {
  const navigation = useNavigation<any>();

  function goToVerse() {
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
  }

  async function shareVerse() {
    try {
      const shareAction = await Share.share({
        message: `"${verse}"
- ${book} ${chapter}:${verseNumber}

Sent with Faith Forward`,
      });
      logShareVerse(book, chapter, verseNumber, shareAction.action);
    } catch (err: any) {
      console.error(err);
    }
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
      <TouchableOpacity onPress={goToVerse}>
        <BigText className="mb-2">
          {book} {chapter}:{verseNumber}
        </BigText>
        <BaseText style={{ fontFamily: "Baskerville", fontWeight: "500" }}>
          "{verse.trim()}"
        </BaseText>
      </TouchableOpacity>
      <View className="flex-row justify-end items-center py-2 mt-2">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => handleUnfavoritingVerse(book, chapter, verseNumber)}
            style={{ paddingRight: 20 }}
          >
            <Ionicons name="heart-sharp" size={24} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareVerse}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
