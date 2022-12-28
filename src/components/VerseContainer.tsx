import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import colors from "../styles/colors";

const VerseContainer: React.FC<{ verse: any; isLoading: boolean }> = ({
  verse,
  isLoading,
}) => {
  return (
    <View style={styles.verse}>
      <ScrollView style={{ paddingTop: 24 }}>
        {verse && verse.response && (
          <Text style={styles.response}>{verse.response}</Text>
        )}
        {isLoading && (
          <ActivityIndicator
            color={colors.blue}
            size={"large"}
            style={{ marginTop: 48 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  response: {
    fontSize: 16,
    padding: 36,
    paddingTop: 8,
    color: "#333",
    lineHeight: 28,
  },
  verse: {
    // paddingTop: 24,
    // marginTop: 24,
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
});

export default VerseContainer;
