import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";
import SmallText from "@src/components/ui/SmallText";
import colors from "@src/styles/colors";
import { TSermon } from "@src/types";
import { Audio } from "expo-av";
import humanizeDuration from "humanize-duration";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Share,
  StyleSheet,
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

const SERMON_MARKETING_URL = "https://faithforward.app/sermons";

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

  const shareSermon = useCallback(async () => {
    const uri = `${SERMON_MARKETING_URL}?sermonID=${sermon.id}`;
    await Share.share({
      message: `Check out this Faith Forward sermon!\n\n${sermon.title}`,
      url: uri,
    });
  }, [sermon]);

  return (
    <View style={styles.sermonSection}>
      <View>
        <BigText className="mb-2">{sermon.title}</BigText>
        <BaseText className="mb-4">{sermon.description}</BaseText>
      </View>
      <View className="flex flex-row items-center mt-4">
        <SmallText className="italic">
          {formatDuration(sermon.duration || null)} with {sermon.speaker}
        </SmallText>
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
          <View style={{ marginRight: 20 }}>
            {faves.includes(sermon.id) ? (
              <TouchableOpacity
                onPress={() => handleUnfavoritingSermon(sermon)}
              >
                <Ionicons name="heart-sharp" size={24} color={colors.red} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleFavoritingSermon(sermon)}>
                <Ionicons name="heart-outline" size={24} color={colors.red} />
              </TouchableOpacity>
            )}
          </View>
          <View>
            <TouchableOpacity onPress={shareSermon}>
              <Ionicons
                name="ios-share-outline"
                size={24}
                color={colors.blue}
              />
            </TouchableOpacity>
          </View>
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
  playingSermonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    verticalAlign: "middle",
    color: "#333",
    width: "50%",
  },
});
