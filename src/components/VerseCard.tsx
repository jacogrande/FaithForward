import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  logFavoriteVerse,
  logShareVerse,
  logUnfavoriteVerse,
} from "@src/analytics";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import { favoriteVerse, unfavoriteVerse } from "@src/firebase";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import React, { useCallback, useEffect, useState } from "react";
import { Share, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export function VerseCard({
  book,
  chapter,
  verseNumber,
  verse,
  favorited,
  onFaveToggle,
}: {
  book: string;
  chapter: number;
  verseNumber: number;
  verse: string;
  favorited: boolean;
  onFaveToggle: () => void;
}) {
  const navigation = useNavigation<any>();
  const [isFavorited, setIsFavorited] = useState(favorited);
  const { setError } = useStore();

  useEffect(() => {
    setIsFavorited(favorited);
  }, [favorited]);

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

  const handleFavoritingVerse = useCallback(async () => {
    try {
      setIsFavorited(true);
      logFavoriteVerse(book, chapter, verseNumber);
      await favoriteVerse("kjv", book, chapter, verseNumber, verse);
    } catch (err: any) {
      console.warn("Error favoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      onFaveToggle();
    }
  }, [book, chapter, verse, verseNumber, onFaveToggle]);

  const handleUnfavoritingVerse = useCallback(async () => {
    try {
      setIsFavorited(false);
      logUnfavoriteVerse(book, chapter, verseNumber);
      await unfavoriteVerse("kjv", book, chapter, verseNumber);
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      onFaveToggle();
    }
  }, [book, chapter, verse, verseNumber, onFaveToggle]);

  // TODO: Include getExegesis action button here

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
          {isFavorited ? (
            <TouchableOpacity
              onPress={handleUnfavoritingVerse}
              className="px-4"
            >
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleFavoritingVerse} className="px-3">
              <Ionicons name="heart-outline" size={24} color={colors.red} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
