import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  logFavoriteVerse,
  logGetExegesis,
  logShareVerse,
  logUnfavoriteVerse,
} from "@src/analytics";
import { ExegesisLoadingMessage } from "@src/components/ExegesisLoadingMessage";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import { API_URL } from "@src/constants";
import { auth, favoriteVerse, unfavoriteVerse } from "@src/firebase";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import React, { useEffect, useState } from "react";
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
  const { setBook, setChapter, setVerseNumber, setVerse, setExegesis } =
    useBibleStore();
  const [isLoadingExegesis, setIsLoadingExegesis] = useState(false);

  useEffect(() => {
    setIsFavorited(favorited);
  }, [favorited]);

  const goToVerse = () => {
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
  };

  const handleShare = async () => {
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
  };

  const handleFavoritingVerse = async () => {
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
  };

  const handleUnfavoritingVerse = async () => {
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
  };

  const getExegesis = async () => {
    try {
      setIsLoadingExegesis(true);
      logGetExegesis(book, chapter, verseNumber, "verse");

      const userId = auth.currentUser?.uid;

      const response = await fetch(`${API_URL}/getExegesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          book,
          chapter,
          verseNumber,
          verse: verse,
        }),
      });

      const data = await response.json();

      setBook(book);
      setChapter(chapter);
      setVerseNumber(verseNumber);
      setVerse(verse);
      setExegesis(data.response);

      navigation.navigate("Verse Analysis", {});
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingExegesis(false);
    }
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
      <TouchableOpacity onPress={goToVerse}>
        <BigText className="mb-2">
          {book} {chapter}:{verseNumber}
        </BigText>
        <BaseText style={{ fontFamily: "Baskerville", fontWeight: "500" }}>
          "{verse.trim()}"
        </BaseText>
      </TouchableOpacity>
      <View className="flex-row justify-end items-center py-2 mt-2">
        <View className="flex-row items-center">
          {isFavorited ? (
            <TouchableOpacity
              onPress={handleUnfavoritingVerse}
              className="px-2"
            >
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleFavoritingVerse} className="px-2">
              <Ionicons name="heart-outline" size={24} color={colors.red} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleShare} className="px-2">
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={getExegesis} className="px-2">
            <FontAwesome5 name="scroll" size={20} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoadingExegesis && <ExegesisLoadingMessage />}
    </View>
  );
}
