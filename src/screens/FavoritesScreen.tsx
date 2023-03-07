import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  logSermonPlay,
  logUnfavoriteDevotional,
  logUnfavoriteExegesis,
  logUnfavoriteSermon,
  logUnfavoriteVerse,
} from "@src/analytics";
import { Container } from "@src/components/Container";
import { DevotionalCard } from "@src/components/DevotionalCard";
import { ExegesesList } from "@src/components/ExegesesList";
import { Loading } from "@src/components/Loading";
import { Sermon } from "@src/components/Sermon";
import { VersesList } from "@src/components/VersesList";
import {
  auth,
  unfavoriteExegesis,
  unfavoritePersonalDevo,
  unfavoriteSermon,
  unfavoriteTradDevo,
  unfavoriteVerse,
} from "@src/firebase";
import { useAudio } from "@src/hooks/useAudio";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastDevos } from "@src/hooks/usePastDevos";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import { useSermons } from "@src/hooks/useSermons";
import { useTradDevos } from "@src/hooks/useTradDevos";
import useStore, { useAudioStore } from "@src/store";
import colors from "@src/styles/colors";
import { TExegesis, TPersonalDevo, TSermon, TTradDevo } from "@src/types";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ViewType = "devos" | "verses" | "sermons" | "exegeses";

export default function FavoritesScreen() {
  const [viewType, setViewType] = useState<ViewType>("devos");

  function handleFilterPress(pressedViewType: ViewType): void {
    switch (pressedViewType) {
      case "devos":
        setViewType("devos");
        break;
      case "sermons":
        setViewType("sermons");
        break;
      case "verses":
        setViewType("verses");
        break;
      case "exegeses":
        setViewType("exegeses");
        break;
      default:
        throw new Error("Unrecognized view type pressed");
    }
  }

  return (
    <Container>
      <View className="flex-1">
        <Filters viewType={viewType} onPressFilter={handleFilterPress} />
        <FavoritesList viewType={viewType} />
      </View>
    </Container>
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

function Filters({
  viewType,
  onPressFilter,
}: {
  viewType: ViewType;
  onPressFilter: (viewType: ViewType) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginVertical: 24,
      }}
    >
      <TouchableOpacity
        onPress={() => onPressFilter("devos")}
        className={`px-6 py-2  rounded-full ${
          viewType === "devos" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <Ionicons
          name="md-sunny"
          size={24}
          color={viewType === "devos" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("verses")}
        className={`px-6 py-2  rounded-full ${
          viewType === "verses" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <Ionicons
          name="book"
          size={24}
          color={viewType === "verses" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("sermons")}
        className={`px-6 py-2  rounded-full ${
          viewType === "sermons" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <FontAwesome5
          name="church"
          size={24}
          color={viewType === "sermons" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("exegeses")}
        className={`px-6 py-2  rounded-full ${
          viewType === "exegeses" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <FontAwesome5
          name="scroll"
          size={24}
          color={viewType === "exegeses" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
    </View>
  );
}

function FavoritesList({ viewType }: { viewType: ViewType }) {
  if (auth.currentUser?.isAnonymous) {
    return (
      <View className="flex-1 my-5 mx-7">
        <Text>You must have an account to save favorites.</Text>
      </View>
    );
  }

  switch (viewType) {
    case "devos":
      return <FavoriteDevos />;
    case "sermons":
      return <FavoriteSermons />;
    case "verses":
      return <FavoriteVerses />;
    case "exegeses":
      return <FavoriteExegeses />;
    default:
      return (
        <View className="flex-1 my-5 mx-7">
          <Text>Oops, something went wrong. Please try again.</Text>
        </View>
      );
  }
}

function FavoriteDevos() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("devos");
  const { setQuietlyRefreshing: setQuietlyRefreshingTradDevos } =
    useTradDevos();
  const { setQuietlyRefreshing: setQuietlyRefreshingPastDevos } =
    usePastDevos();
  const [favoriteDevos, setFavoriteDevos] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
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
    setQuietlyRefreshing(true)
    setQuietlyRefreshingPastDevos(true)
    setQuietlyRefreshingTradDevos(true)
  }, [JSON.stringify(favorites)]);

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
      logUnfavoriteDevotional(tradDevo.id, tradDevo.title);
      await unfavoriteTradDevo(tradDevo);
    } catch (err: any) {
      console.warn("Error unfavoriting tradDevo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingTradDevos(true);
    }
  }

  async function handleUnfavoritingPersonalDevo(devo: TPersonalDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== devo.id));
      logUnfavoriteDevotional(devo.id, "Personal Devo");
      await unfavoritePersonalDevo(devo);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingPastDevos(true);
    }
  }

  if (loading) return <Loading />;

  return (
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
  );
}

function FavoriteSermons() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("sermons");
  const { setQuietlyRefreshing: setQuietlyRefreshingSermons } = useSermons();
  const { stopSound, playSound } = useAudio();
  const { sound, playingAudioObject, setPlayingAudioObject } = useAudioStore();
  const [favoriteSermons, setFavoriteSermons] = useState<TSermon[]>([]);
  const { setError } = useStore();

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
    setQuietlyRefreshing(true)
    setQuietlyRefreshingSermons(true)
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
      logUnfavoriteSermon(sermon.id, sermon.title);
      await unfavoriteSermon(sermon);
    } catch (err: any) {
      console.warn("Error unfavoriting sermon:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingSermons(true);
    }
  }

  if (loading) return <Loading />;

  return (
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
  );
}

function FavoriteVerses() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("verses");
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
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
    setQuietlyRefreshing(true)
  }, [JSON.stringify(favorites)]);

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
      logUnfavoriteVerse(book, chapter, verseNumber);
      await unfavoriteVerse("kjv", book, chapter, verseNumber);
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
    }
  }

  if (loading) return <Loading />;

  return (
    <VersesList
      verses={favoriteVerses}
      handleUnfavoritingVerse={handleUnfavoritingVerse}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}

function FavoriteExegeses() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("exegeses");
  const { setQuietlyRefreshing: setQuietlyRefreshingPastExegeses } =
    usePastExegeses();
  const [favoriteExegeses, setFavoriteExegeses] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
    setFavoriteExegeses(
      favorites
        .filter((fave) => fave.type === "exegesis")
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
    setQuietlyRefreshing(true)
    setQuietlyRefreshingPastExegeses(true)
  }, [JSON.stringify(favorites)]);

  async function handleUnfavoritingExegesis(exegesis: TExegesis) {
    try {
      setFavoriteExegeses(
        favoriteExegeses.filter((fave) => fave.id !== exegesis.id)
      );
      logUnfavoriteExegesis(
        exegesis.id,
        exegesis.book || "",
        exegesis.chapter || 0,
        exegesis.verseNumber || 0
      );
      await unfavoriteExegesis(exegesis);
    } catch (err: any) {
      console.warn("Error unfavoriting exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingPastExegeses(true);
    }
  }

  if (loading) return <Loading />;

  return (
    <ExegesesList
      exegeses={favoriteExegeses}
      faves={favoriteExegeses.map((fave) => fave.id)}
      handleUnfavoritingExegesis={handleUnfavoritingExegesis}
      handleFavoritingExegesis={null}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}
