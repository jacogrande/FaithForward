import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import humanizeDuration from "humanize-duration";
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
import { auth, favoriteSermon, unfavoriteSermon } from "../../firebase";
import { TSermon } from "../../types";
import { Container } from "../components/Container";
import { useAudio } from "../hooks/useAudio";
import { useSermons } from "../hooks/useSermons";
import useStore, { useAudioStore } from "../Store";
import colors from "../styles/colors";

function initOptimisticFaves(sermons: TSermon[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return sermons
    .filter((sermon) =>
      sermon.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((sermon) => sermon.id);
}

export default function SermonsScreen() {
  const { sermons, loading, refreshing, setRefreshing, setQuietlyRefreshing } =
    useSermons();
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
    console.log(
      "playingAudioObject?.id === sermon.id:",
      playingAudioObject?.id === sermon.id
    );
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

  async function handleFavoritingSermon(sermon: TSermon) {
    try {
      setOptimisticFaves([...optimisticFaves, sermon.id]);
      await favoriteSermon(sermon);
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error favoriting sermon:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingSermon(sermon: TSermon) {
    try {
      setOptimisticFaves(optimisticFaves.filter((id) => id !== sermon.id));
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
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
      )}
    </Container>
  );
}

function SermonPlayButton(props: { onPress: () => void }) {
  const { onPress } = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome5 name="play" size={20} color={colors.blue} />
    </TouchableOpacity>
  );
}

function SermonPauseButton() {
  return <AntDesign name="sound" size={28} color={colors.blue} />;
}

// Duration is a float in seconds
const formatDuration = (duration: number | null): string => {
  // Duration is either a float in seconds, or null
  if (duration === null) {
    return "Time";
  }

  return humanizeDuration(duration * 1000, { round: true, units: ["m"] });
};

interface SermonProps {
  sermon: TSermon;
  playingSermonId: string | null;
  faves: string[];
  sound: Audio.Sound | null;
  startPlayingSermon: (sermon: TSermon) => void;
  handleFavoritingSermon: (sermon: TSermon) => void;
  handleUnfavoritingSermon: (sermon: TSermon) => void;
}

function Sermon(props: SermonProps) {
  const {
    sound,
    faves,
    sermon,
    playingSermonId,
    startPlayingSermon,
    handleFavoritingSermon,
    handleUnfavoritingSermon,
  } = props;

  return (
    <View style={styles.sermonSection}>
      <View>
        <Text style={styles.sermonTitle}>{sermon.title}</Text>
        <Text style={styles.sermonDescription}>{sermon.description}</Text>
      </View>
      <View style={styles.actionButtons}>
        <Text style={styles.sermonSpeaker}>
          {formatDuration(sermon.duration || null)} with {sermon.speaker}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ marginRight: 20 }}>
            {playingSermonId === sermon.id && !!sound ? (
              <SermonPauseButton />
            ) : playingSermonId === sermon.id && !sound ? (
              <ActivityIndicator size={20} color={colors.blue} />
            ) : (
              <SermonPlayButton onPress={() => startPlayingSermon(sermon)} />
            )}
          </View>
          {faves.includes(sermon.id) ? (
            <TouchableOpacity onPress={() => handleUnfavoritingSermon(sermon)}>
              <Ionicons name="heart-sharp" size={24} color={colors.red} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleFavoritingSermon(sermon)}>
              <Ionicons name="heart-outline" size={24} color={colors.red} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sermonsContainer: {
    backgroundColor: "#fff",
    padding: 24,
  },
  sermonSection: {
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 2,
    paddingVertical: 24,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  sermonDescription: {
    fontSize: 16,
    paddingBottom: 10,
  },
  sermonSpeaker: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
  },
  audioControlContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.lightBlue,
    zIndex: 10,
    opacity: 1,
    borderTopColor: colors.blue,
    borderTopWidth: 1,
  },
  audioControlButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  playingSermonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    verticalAlign: "middle",
    color: "#333",
    width: "50%",
  },
  buttonActive: {
    backgroundColor: colors.orange,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
