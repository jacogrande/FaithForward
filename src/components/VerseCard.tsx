import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logShareVerse } from "@src/analytics";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import colors from "@src/styles/colors";
import React, { useCallback } from "react";
import { Share, TouchableOpacity, View } from "react-native";

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

  const goToVerse = useCallback(() => {
    navigation.navigate("Bible", {
      screen: "ReaderAndStudy",
      params: {
        screen: "Reader",
        params: {
          book,
          chapter,
        },
      },
    });
  }, [book, chapter]);

  const handleShare = useCallback(async () => {
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
  }, [book, chapter, verseNumber]);

  const unfavoriteVerse = useCallback(() => {
    handleUnfavoritingVerse(book, chapter, verseNumber);
  }, [book, chapter, verseNumber]);

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
            onPress={unfavoriteVerse}
            style={{ paddingRight: 20 }}
          >
            <Ionicons name="heart-sharp" size={24} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
