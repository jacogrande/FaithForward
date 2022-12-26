import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Button,
  ScrollView,
} from "react-native";
import colors from "../styles/colors";
import KeywordChip from "./KeywordChip";

interface Props {
  onPress: (input: string) => void;
}

interface IKeywordDictionary {
  [key: string]: string[];
}

const emotions: string[] = [
  "Happiness",
  "Sadness",
  "Fear",
  "Anger",
  "Surprise",
  "Disgust",
  "Love",
  "Guilt",
  "Envy",
  "Jealousy",
  "Embarrassment",
  "Nostalgia",
  "Awe",
  "Curiosity",
  "Excitement",
  "Optimism",
  "Pessimism",
].sort(() => 0.5 - Math.random());

const topics: string[] = [
  "Work",
  "Relationships",
  "Church",
  "Family",
  "Health",
  "Finance",
  "Education",
  "Leisure",
  "Travel",
  "Politics",
].sort(() => 0.5 - Math.random());

const KeywordManager: React.FC<Props> = ({ onPress }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [opacity] = useState(new Animated.Value(1));

  const selectEmotion = (emotion: string) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setSelectedEmotion(emotion);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 600);
  };

  const handlePress = (keyword: string) => {
    if (!selectedEmotion) {
      selectEmotion(keyword);
    } else {
      onPress(`I feel ${selectedEmotion} about ${keyword}`);
    }
  };

  const handleBack = () => {
    setSelectedEmotion(null);
    onPress("");
  };

  return (
    <View style={styles.container}>
      {selectedEmotion && (
        <Button onPress={handleBack} title="Back" color={colors.orange} />
      )}
      <Animated.View style={[styles.keywordChipsContainer, { opacity }]}>
        <ScrollView horizontal>
          {(selectedEmotion ? topics : emotions).map((keyword) => (
            <KeywordChip
              keyword={keyword}
              onPress={() => handlePress(keyword)}
              key={keyword}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: 8,
  },
  keywordChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keywordsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
export default KeywordManager;
