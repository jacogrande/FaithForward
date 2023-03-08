import {
  logFavoriteSermon,
  logSermonPlay,
  logUnfavoriteSermon,
} from "@src/analytics";
import { Container } from "@src/components/ui/Container";
import { Loading } from "@src/components/Loading";
import { Sermon } from "@src/components/Sermon";
import { auth, favoriteSermon, unfavoriteSermon } from "@src/firebase";
import { useAudio } from "@src/hooks/useAudio";
import { useFavorites } from "@src/hooks/useFavorites";
import { useSermons } from "@src/hooks/useSermons";
import useStore, { useAudioStore } from "@src/store";
import colors from "@src/styles/colors";
import { TSermon } from "@src/types";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

function initOptimisticFaves(sermons: TSermon[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return sermons
    .filter((sermon: TSermon) =>
      sermon.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((sermon: TSermon) => sermon.id);
}

export default function SermonsScreen() {
  const { sermons, loading, refreshing, setRefreshing, setQuietlyRefreshing } =
    useSermons();
  const { setQuietlyRefreshing: setQuietlyRefreshingFaves } = useFavorites({
    fetch: false,
    faveType: "sermons",
  });
  const [optimisticFaves, setOptimisticFaves] = useState<string[]>(
    initOptimisticFaves(sermons)
  );
  const { stopSound, playSound } = useAudio();
  const { sound, playingAudioObject, setPlayingAudioObject } = useAudioStore();
  const { setError } = useStore();

  useEffect(() => {
    setOptimisticFaves(initOptimisticFaves(sermons));
  }, [JSON.stringify(sermons)]);

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

  async function handleFavoritingSermon(sermon: TSermon) {
    try {
      setOptimisticFaves((optimisticFaves) => [...optimisticFaves, sermon.id]);
      await favoriteSermon(sermon);
      logFavoriteSermon(sermon.id, sermon.title);
    } catch (err: any) {
      console.warn("Error favoriting sermon:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }

  async function handleUnfavoritingSermon(sermon: TSermon) {
    try {
      setOptimisticFaves((optimisticFaves) =>
        optimisticFaves.filter((id) => id !== sermon.id)
      );
      await unfavoriteSermon(sermon);
      logUnfavoriteSermon(sermon.id, sermon.title);
    } catch (err: any) {
      console.warn("Error unfavoriting sermon:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <FlatList
        style={styles.sermonsContainer}
        data={sermons}
        keyExtractor={(sermon: TSermon) => sermon.id}
        renderItem={({ item: sermon }: { item: TSermon }) => (
          <Sermon
            sermon={sermon}
            faves={optimisticFaves}
            sound={sound}
            playingSermonId={playingAudioObject?.id || null}
            startPlayingSermon={startPlayingSermon}
            handleFavoritingSermon={handleFavoritingSermon}
            handleUnfavoritingSermon={handleUnfavoritingSermon}
          />
        )}
        ListEmptyComponent={<Text>No sermons to display.</Text>}
        ListFooterComponent={<View style={{ height: 100 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  sermonsContainer: {
    backgroundColor: colors.paper,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
