import { logSermonPlay, logUnfavoriteSermon } from "@src/analytics";
import { EmptyFavorites } from "@src/components/EmptyFavorites";
import { Loading } from "@src/components/Loading";
import { Sermon } from "@src/components/Sermon";
import { unfavoriteSermon } from "@src/firebase";
import { useAudio } from "@src/hooks/useAudio";
import { useFavorites } from "@src/hooks/useFavorites";
import { useSermons } from "@src/hooks/useSermons";
import useStore, { useAudioStore } from "@src/store";
import { TSermon } from "@src/types";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

export function FavoriteSermons() {
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
    setQuietlyRefreshing(true);
    setQuietlyRefreshingSermons(true);
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
