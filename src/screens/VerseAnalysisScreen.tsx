import LoadingMessages from "@src/components/LoadingMessages";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useApi } from "@src/hooks/useApi";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const VerseAnalysisScreen: React.FC = () => {
  const { input, selectedVerse, promptId } = useStore();

  const {
    isLoading,
    data,
    fetchData: getExegesis,
  } = useApi<{ response: string }>(`${API_URL}/analyzeVerse`, {
    method: "POST",
    body: JSON.stringify({
      userId: auth.currentUser?.uid,
      prompt: input,
      promptId: promptId,
      verse: selectedVerse,
    }),
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (selectedVerse) {
      getExegesis();
    }
  }, [selectedVerse]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {isLoading ? (
        <LoadingMessages />
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, styles.highlight]}>{selectedVerse}</Text>
          <Text style={styles.text}>
            {data
              ? data.response
              : "Oops... something went wrong. Please try again later"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 48,
  },
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
  },
  text: {
    fontSize: 16,
    marginHorizontal: "10%",
    padding: 8,
    color: "#333",
    lineHeight: 28,
  },
});

export default VerseAnalysisScreen;
