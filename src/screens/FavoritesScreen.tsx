import { onIdTokenChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth, unfavoriteSermon } from "../../firebase";
import { TSermon } from "../../types";
import { Container } from "../components/Container";
import { Sermon } from "../components/Sermon";
import { useAudio } from "../hooks/useAudio";
import { useFavorites } from "../hooks/useFavorites";
import useStore, { useAudioStore } from "../Store";

// TODO: Add proper handling for different fave types
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
    setFavoriteSermons(favorites.map((fave) => ({ ...fave.docData })));
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

  return (
    <Container>
      <View style={styles.container}>
        {isAnonymous ? (
          <Text>You must have an account to save favorites.</Text>
        ) : (
          <View>
            {loading ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : (
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
                ListEmptyComponent={<Text>No sermons to display.</Text>}
                ListFooterComponent={<View style={{ height: 100 }} />}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => setRefreshing(true)}
                  />
                }
              />
            )}
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
