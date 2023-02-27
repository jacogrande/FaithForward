import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import colors from "@src/styles/colors";
import { TSermon } from "@src/types";
import { Audio } from "expo-av";
import humanizeDuration from "humanize-duration";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SermonProps {
  sermon: TSermon;
  playingSermonId: string | null;
  faves: string[];
  sound: Audio.Sound | null;
  startPlayingSermon: (sermon: TSermon) => void;
  handleFavoritingSermon: (sermon: TSermon) => void;
  handleUnfavoritingSermon: (sermon: TSermon) => void;
}

export function Sermon(props: SermonProps) {
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
        <Text className="text-lg text-ffBlack font-bold leading-tight mb-2">
          {sermon.title}
        </Text>
        <Text style={styles.sermonDescription}>{sermon.description}</Text>
      </View>
      <View className="flex flex-row items-center mt-4">
        <Text style={styles.sermonSpeaker}>
          {formatDuration(sermon.duration || null)} with {sermon.speaker}
        </Text>
        <View className="flex-1 flex flex-row items-center justify-end">
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

const styles = StyleSheet.create({
  sermonSection: {
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 2,
    padding: 24,
    backgroundColor: colors.paper,
  },
  sermonDescription: {
    fontSize: 16,
    paddingBottom: 10,
    color: "#333",
  },
  sermonSpeaker: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
    // marginTop: 8,
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
});
