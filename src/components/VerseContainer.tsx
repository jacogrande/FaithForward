import { Animated, ScrollView, Text, StyleSheet } from "react-native";
import colors from "../styles/colors";

const VerseContainer: React.FC<{ verse: any; anim: Animated.Value }> = ({
  verse,
  anim,
}) => {
  return (
    <Animated.View style={[styles.verse, { opacity: anim }]}>
      <ScrollView style={{ paddingTop: 24 }}>
        {verse && verse.response ? (
          <Text style={styles.response}>{verse.response}</Text>
        ) : (
          <Text style={styles.response}>Loading</Text>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  response: {
    fontSize: 20,
    padding: 36,
    paddingTop: 8,
    color: "#333",
    lineHeight: 28,
  },
  verse: {
    flex: 1,
    // paddingTop: 24,
    // marginTop: 24,
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
});

export default VerseContainer;
