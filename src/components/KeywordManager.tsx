import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import HeaderChip from "./HeaderChip";
import KeywordChip from "./KeywordChip";

const emotions: string[] = [
  "Happy",
  "Sad",
  "Angry",
  "Fearful",
  "Loving",
  "Hopeful",
  "Envious",
  "Disgusted",
  "Frustrated",
  "Confused",
  "Anxious",
  "Excited",
  "Depressed",
  "Proud",
  "Embarrassed",
  "Guilty",
].sort((a, b) => a.localeCompare(b));

const topics: string[] = [
  "Relationships",
  "Family",
  "Career",
  "Finances",
  "Health",
  "Politics",
  "Self-Esteem",
  "Loss",
  "Change",
  "Failure",
  "Success",
  "Safety",
  "Rejection",
  "Values",
  "Self-Expression",
  "Mortality",
].sort((a, b) => a.localeCompare(b));

interface Props {
  setTopic: (newValue: string | null) => void;
  setEmotion: (newValue: string | null) => void;
  setShowSubmit: (newValue: boolean) => void;
  verseLoaded: boolean;
  resetParent: () => void;
}

const KeywordManager: React.FC<Props> = ({
  setTopic,
  setEmotion,
  setShowSubmit,
  resetParent,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [opacity] = useState(new Animated.Value(1));

  const selectTopic = (emotion: string) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setSelectedTopic(emotion);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setShowSubmit(true);
    }, 600);
  };

  const handlePress = (keyword: string) => {
    if (!selectedTopic) {
      selectTopic(keyword);
      setTopic(keyword);
    } else {
      setSelectedEmotion(keyword);
      setEmotion(keyword);
    }
  };

  const handleSomethingElse = () => {
    setSelectedEmotion(null);
    setShowSubmit(false);
    setTopic("Something Else");
  };

  const reset = () => {
    setSelectedEmotion(null);
    setSelectedTopic(null);
    setShowSubmit(false);
    resetParent();
  };

  return (
    <View style={styles.container}>
      {selectedTopic && (
        <View
          style={{
            flexDirection: "row",
            marginVertical: 12,
            alignItems: "baseline",
          }}
        >
          <HeaderChip keyword={selectedTopic} onPress={reset} />
          {/* <Text style={styles.header}>?</Text> */}
        </View>
      )}
      <Animated.View style={[styles.keywordChipsContainer, { opacity }]}>
        <View style={styles.keywordChipsContainer}>
          {(selectedTopic ? emotions : topics).map((keyword) => (
            <KeywordChip
              keyword={keyword}
              onPress={() => handlePress(keyword)}
              active={selectedTopic ? keyword === selectedEmotion : false}
              key={keyword}
            />
          ))}
          {!selectedTopic && (
            <KeywordChip
              keyword="Something Else"
              onPress={handleSomethingElse}
            />
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
  },

  keywordChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
  },
  keywordsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
export default KeywordManager;
