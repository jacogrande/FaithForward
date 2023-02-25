import { onIdTokenChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  auth,
  unfavoritePersonalDevo,
  unfavoriteSermon,
  unfavoriteTradDevo,
} from "../../firebase";
import { TPersonalDevo, TSermon, TTradDevo } from "../../types";
import { Container } from "../components/Container";
import { DevotionalCard } from "../components/DevotionalCard";
import { Sermon } from "../components/Sermon";
import { useAudio } from "../hooks/useAudio";
import { useFavorites } from "../hooks/useFavorites";
import useStore, { useAudioStore } from "../Store";
import colors from "../styles/colors";

// TODO: Refresh list when faves change on other screens
export default function FavoritesScreen() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites();
  const { stopSound, playSound } = useAudio();
  const { sound, playingAudioObject, setPlayingAudioObject } = useAudioStore();
  const [favoriteSermons, setFavoriteSermons] = useState<TSermon[]>([]);
  const [favoriteDevos, setFavoriteDevos] = useState<any[]>([]);
  const [expandedDevoId, setExpandedDevoId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"sermons" | "devos">("sermons");

  const { setError } = useStore();

  onIdTokenChanged(auth, (user) => {
    if (user?.isAnonymous) {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  });

  // Set favoriteSermons when favorites updates
  useEffect(() => {
    setFavoriteSermons(
      favorites
        .filter((fave) => fave.type === "sermon")
        .map((fave) => ({ ...fave.docData }))
    );
    setFavoriteDevos(
      favorites
        .filter(
          (fave) => fave.type === "tradDevo" || fave.type === "personalDevo"
        )
        .map((fave) => ({ ...fave.docData }))
    );
  }, [JSON.stringify(favorites)]);

  async function startPlayingSermon(sermon: TSermon) {
    try {
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
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error unfavoriting sermon:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingTradDevo(tradDevo: TTradDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== tradDevo.id));
      await unfavoriteTradDevo(tradDevo);
      setQuietlyRefreshing(true);
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
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
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

  return (
    <Container>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <TouchableOpacity
            onPress={viewSermons}
            style={{
              padding: 8,
              backgroundColor:
                viewType === "sermons" ? colors.blue : colors.lightBlue,
              borderRadius: 8,
              marginRight: 20,
            }}
          >
            <Text>Sermons</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={viewDevos}
            style={{
              padding: 8,
              backgroundColor:
                viewType === "devos" ? colors.blue : colors.lightBlue,
              borderRadius: 8,
            }}
          >
            <Text>Devotionals</Text>
          </TouchableOpacity>
        </View>
        {isAnonymous ? (
          <Text>You must have an account to save favorites.</Text>
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
                    isExpanded={expandedDevoId === devo.id}
                    faves={favoriteDevos.map((fave) => fave.id)}
                    onPress={() =>
                      setExpandedDevoId(
                        expandedDevoId === devo.id ? null : devo.id
                      )
                    }
                    handleFavoritingDevo={() => {}}
                    handleUnfavoritingDevo={
                      devo.favorited
                        ? handleUnfavoritingPersonalDevo
                        : handleUnfavoritingTradDevo
                    }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
