import { Ionicons } from "@expo/vector-icons";
import { logShareExegesis } from "@src/analytics";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import { favoriteExegesis, unfavoriteExegesis } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import { TExegesis } from "@src/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function ExegesisScreen() {
  const [isFavorited, setIsFavorited] = useState(false);
  const { verse, book, chapter, verseNumber, exegesis } = useBibleStore();
  const { pastExegeses, setQuietlyRefreshing } = usePastExegeses();
  const { setQuietlyRefreshing: setQuietlyRefreshingFaves } =
    useFavorites("exegeses");
  const { setError } = useStore();
  const [firestoreExegesis, setFirestoreExegesis] = useState<TExegesis | null>(
    null
  );

  useEffect(() => {
    const fe = pastExegeses.find((exegesis) => {
      return (
        exegesis.book === book &&
        exegesis.chapter === chapter &&
        exegesis.verseNumber === verseNumber
      );
    });

    if (fe) {
      setFirestoreExegesis(fe);
      setIsFavorited(fe.favorited);
    }
  }, [exegesis, JSON.stringify(pastExegeses)]);

  const handleFavoritingExegesis = useCallback(async () => {
    try {
      if (!firestoreExegesis) {
        throw new Error("Missing firestoreExegesis");
      }

      setIsFavorited(true);
      await favoriteExegesis(firestoreExegesis);
    } catch (err: any) {
      console.warn("Error favoriting exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }, [
    firestoreExegesis,
    setError,
    setQuietlyRefreshing,
    setQuietlyRefreshingFaves,
  ]);

  const handleUnfavoritingExegesis = useCallback(async () => {
    try {
      if (!firestoreExegesis) {
        throw new Error("Missing firestoreExegesis");
      }

      setIsFavorited(false);
      await unfavoriteExegesis(firestoreExegesis);
    } catch (err: any) {
      console.warn("Error unfavoriting exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }, [
    firestoreExegesis,
    setError,
    setQuietlyRefreshing,
    setQuietlyRefreshingFaves,
  ]);

  const shareExegesis = useCallback(async () => {
    try {
      if (!firestoreExegesis) {
        throw new Error("Missing firestoreExegesis");
      }

      let shareAction;
      // Build message differently for general exegeses vs verse exegeses
      if (firestoreExegesis.type === "general") {
        shareAction = await Share.share({
          message: `"${firestoreExegesis.input}"

${firestoreExegesis.response}


Sent with Faith Forward`,
        });
      } else {
        shareAction = await Share.share({
          message: `"${firestoreExegesis.verse}"
- ${firestoreExegesis.book} ${firestoreExegesis.chapter}:${firestoreExegesis.verseNumber}

${firestoreExegesis.response}


Sent with Faith Forward`,
        });
      }

      logShareExegesis(
        firestoreExegesis.id,
        firestoreExegesis.book || "",
        firestoreExegesis.chapter || 0,
        firestoreExegesis.verseNumber || 0,
        firestoreExegesis.type || "unknown",
        shareAction.action
      );
    } catch (err: any) {
      console.error(err);
    }
  }, [firestoreExegesis]);

  const formattedVerse = useMemo(() => {
    if (!verse) {
      return "";
    }

    return formatVerse(verse);
  }, [verse]);

  if (!verse || !book || !chapter || !verseNumber || !exegesis) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1 bg-ffPaper pb-20"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-10">
        <View className="flex-1 bg-ffPaper justify-center items-center pb-3 px-[10%]">
          <BigText className="p-4" style={styles.highlight}>{`${formattedVerse}
- ${book} ${chapter}:${verseNumber}`}</BigText>
          <BaseText>{exegesis}</BaseText>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "15%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {isFavorited ? (
            <TouchableOpacity
              onPress={handleUnfavoritingExegesis}
              style={{ paddingRight: 20 }}
            >
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleFavoritingExegesis}
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
    </ScrollView>
  );
}

function formatVerse(verse: string): string {
  // Add quotes around the verse only if it doesn't already have them
  if (verse.startsWith('"') && verse.endsWith('"')) {
    return verse;
  }
  return `"${verse}"`;
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
    marginVertical: 15,
  },
});

export default ExegesisScreen;
