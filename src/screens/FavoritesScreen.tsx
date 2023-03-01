import { Ionicons } from "@expo/vector-icons";
import {
  logSermonPlay,
  logUnfavoriteDevotional,
  logUnfavoriteSermon,
} from "@src/analytics";
import { Container } from "@src/components/Container";
import { DevotionalCard } from "@src/components/DevotionalCard";
import { Sermon } from "@src/components/Sermon";
import {
  auth,
  unfavoritePersonalDevo,
  unfavoriteSermon,
  unfavoriteTradDevo,
  unfavoriteVerse,
} from "@src/firebase";
import { useAudio } from "@src/hooks/useAudio";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastDevos } from "@src/hooks/usePastDevos";
import { useSermons } from "@src/hooks/useSermons";
import { useTradDevos } from "@src/hooks/useTradDevos";
import useStore, { useAudioStore } from "@src/store";
import colors from "@src/styles/colors";
import { TPersonalDevo, TSermon, TTradDevo } from "@src/types";
import { onIdTokenChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites();
  const { setQuietlyRefreshing: setQuietlyRefreshingSermons } = useSermons();
  const { setQuietlyRefreshing: setQuietlyRefreshingTradDevos } =
    useTradDevos();
  const { setQuietlyRefreshing: setQuietlyRefreshingPastDevos } =
    usePastDevos();
  const { stopSound, playSound } = useAudio();
  const { sound, playingAudioObject, setPlayingAudioObject } = useAudioStore();
  const [favoriteSermons, setFavoriteSermons] = useState<TSermon[]>([]);
  const [favoriteDevos, setFavoriteDevos] = useState<any[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);
  const [viewType, setViewType] = useState<"sermons" | "devos" | "verses">(
    "devos"
  );
  const { setError } = useStore();

  onIdTokenChanged(auth, (user) => {
    if (user?.isAnonymous) {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  });

  // Set favorites when favorites updates
  useEffect(() => {
    setFavoriteSermons(
      favorites
        .filter((fave) => fave.type === "sermon")
        .sort((a, b) => {
          // Sort by createdAt
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return 0;
        })
        .map((fave) => ({ ...fave.docData }))
    );
    setFavoriteDevos(
      favorites
        .filter(
          (fave) => fave.type === "tradDevo" || fave.type === "personalDevo"
        )
        .sort((a, b) => {
          // Sort by createdAt
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return 0;
        })
        .map((fave) => ({ ...fave.docData }))
    );
    setFavoriteVerses(
      favorites
        .filter((fave) => fave.type === "verse")
        .sort((a, b) => {
          // Sort by createdAt
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return 0;
        })
        .map((fave) => ({ ...fave.docData }))
    );
  }, [JSON.stringify(favorites)]);

  async function startPlayingSermon(sermon: TSermon) {
    try {
      logSermonPlay(sermon.id, sermon.title);
      if (playingAudioObject?.id === sermon.id) {
        await playSound(null);
      } else {
        await stopSound();
        setPlayingAudioObject(sermon);
        await playSound(sermon.filename);
      }
    } catch (err: any) {
      console.warn("Error playing sermon:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingSermon(sermon: TSermon) {
    try {
      setFavoriteSermons(
        favoriteSermons.filter((fave) => fave.id !== sermon.id)
      );
      await unfavoriteSermon(sermon);
      logUnfavoriteSermon(sermon.id, sermon.title);
      setQuietlyRefreshing(true);
      setQuietlyRefreshingSermons(true);
    } catch (err: any) {
      console.warn("Error unfavoriting sermon:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingDevo(devo: TTradDevo | TPersonalDevo) {
    const fave = favorites.find((fave) => fave.docId === devo.id);

    switch (fave?.type) {
      case "tradDevo":
        handleUnfavoritingTradDevo(devo as TTradDevo);
        break;
      case "personalDevo":
        handleUnfavoritingPersonalDevo(devo as TPersonalDevo);
        break;
      default:
        console.warn("Error unfavoriting devo: fave.type is not valid");
        break;
    }
  }

  async function handleUnfavoritingTradDevo(tradDevo: TTradDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== tradDevo.id));
      await unfavoriteTradDevo(tradDevo);
      logUnfavoriteDevotional(tradDevo.id, tradDevo.title);
      setQuietlyRefreshing(true);
      setQuietlyRefreshingTradDevos(true);
    } catch (err: any) {
      console.warn("Error unfavoriting tradDevo:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingPersonalDevo(devo: TPersonalDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== devo.id));
      await unfavoritePersonalDevo(devo);
      logUnfavoriteDevotional(devo.id, "Personal Devo");
      setQuietlyRefreshing(true);
      setQuietlyRefreshingPastDevos(true);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
      console.error(err);
      setError(err.message);
    }
  }

  // TODO: Add analytics
  async function handleUnfavoritingVerse(
    book: string,
    chapter: number,
    verseNumber: number
  ): Promise<void> {
    try {
      setFavoriteVerses(
        favoriteVerses.filter(
          (fave) =>
            fave.book !== book &&
            fave.chapter !== chapter &&
            fave.verseNumber !== verseNumber
        )
      );
      await unfavoriteVerse("kjv", book, chapter, verseNumber);
      /* logUnfavoriteDevotional(devo.id, "Personal Devo"); */
      setQuietlyRefreshing(true);
      /* setQuietlyRefreshingPastDevos(true); */
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    }
  }

  function viewSermons() {
    setViewType("sermons");
    setQuietlyRefreshing(true);
  }

  function viewDevos() {
    setViewType("devos");
    setQuietlyRefreshing(true);
  }

  function viewVerses() {
    setViewType("verses");
    setQuietlyRefreshing(true);
  }

  return (
    <Container>
      <View className="flex-1">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 24,
            marginVertical: 24,
          }}
        >
          <TouchableOpacity
            onPress={viewDevos}
            className={`px-6 py-2 mr-4 rounded-full ${
              viewType === "devos" ? "bg-ffBlue" : "bg-ffDarkPaper"
            }`}
          >
            <Text
              className={`${
                viewType === "devos" ? "text-white" : "text-ffBlack"
              } font-semibold`}
            >
              Devotionals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={viewSermons}
            className={`px-6 py-2 mr-4 rounded-full ${
              viewType === "sermons" ? "bg-ffBlue" : "bg-ffDarkPaper"
            }`}
          >
            <Text
              className={`${
                viewType === "sermons" ? "text-white" : "text-ffBlack"
              } font-semibold`}
            >
              Sermons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={viewVerses}
            className={`px-6 py-2 mr-4 rounded-full ${
              viewType === "verses" ? "bg-ffBlue" : "bg-ffDarkPaper"
            }`}
          >
            <Text
              className={`${
                viewType === "verses" ? "text-white" : "text-ffBlack"
              } font-semibold`}
            >
              Verses
            </Text>
          </TouchableOpacity>
        </View>
        {isAnonymous ? (
          <View className="flex-1 my-5 mx-7">
            <Text>You must have an account to save favorites.</Text>
          </View>
        ) : (
          <View>
            {loading ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : viewType === "sermons" ? (
              <FlatList
                data={favoriteSermons}
                renderItem={({ item: sermon }: { item: TSermon }) => (
                  <Sermon
                    sermon={sermon}
                    faves={favoriteSermons.map((fave) => fave.id)}
                    sound={sound}
                    playingSermonId={playingAudioObject?.id || null}
                    startPlayingSermon={startPlayingSermon}
                    handleFavoritingSermon={() => {}}
                    handleUnfavoritingSermon={handleUnfavoritingSermon}
                  />
                )}
                keyExtractor={(item) => item.id}
                style={{ height: "100%" }}
                ListEmptyComponent={<EmptyFavorites />}
                ListFooterComponent={<View style={{ height: 100 }} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                  />
                }
              />
            ) : viewType === "devos" ? (
              <FlatList
                data={favoriteDevos}
                renderItem={({ item: devo }: { item: any }) => (
                  <DevotionalCard
                    devotional={devo}
                    faves={favoriteDevos.map((fave) => fave.id)}
                    handleFavoritingDevo={() => {}}
                    handleUnfavoritingDevo={handleUnfavoritingDevo}
                  />
                )}
                keyExtractor={(item) => item.id}
                style={{ height: "100%" }}
                ListEmptyComponent={<EmptyFavorites />}
                ListFooterComponent={<View style={{ height: 100 }} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                  />
                }
              />
            ) : viewType === "verses" ? (
              <FlatList
                data={favoriteVerses}
                renderItem={({ item: verse }: { item: any }) => (
                  <VerseCard
                    book={verse.book}
                    chapter={verse.chapter}
                    verseNumber={verse.verseNumber}
                    verse={verse.verse}
                    handleUnfavoritingVerse={handleUnfavoritingVerse}
                  />
                )}
                keyExtractor={(item) =>
                  `${item.book}${item.chapter}${item.verseNumber}`
                }
                style={{ height: "100%" }}
                ListEmptyComponent={<EmptyFavorites />}
                ListFooterComponent={<View style={{ height: 100 }} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                  />
                }
              />
            ) : (
              <Text>
                Unrecognized view type for favorites screen, {viewType}.
              </Text>
            )}
          </View>
        )}
      </View>
    </Container>
  );
}

function VerseCard({
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
  // TODO: Implement
  // TODO: Add analytics
  function goToVerse() {}

  // TODO: Add analytics
  async function shareVerse() {
    await Share.share({
      message: `"${verse}"
- ${book} ${chapter}:${verseNumber}

Sent with Faith Forward`,
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
      <TouchableOpacity onPress={goToVerse}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 28,
            color: "#333",
            fontFamily: "Baskerville",
            fontWeight: "600",
            backgroundColor: "#fff3a8",
            padding: 8,
          }}
        >
          "{verse.trim()}"
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 28,
            color: "#333",
            fontFamily: "Baskerville",
            fontWeight: "600",
            backgroundColor: "#fff3a8",
            padding: 8,
          }}
        >
          - {book} {chapter}:{verseNumber}
        </Text>
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

const EmptyFavorites = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 40,
      }}
    >
      <Text style={{ fontSize: 16 }}>No favorites to display.</Text>
    </View>
  );
};
