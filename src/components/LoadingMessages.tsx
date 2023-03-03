import { LOADING_MESSAGES } from "@src/constants";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import colors from "@src/styles/colors";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingMessages = () => {
  const loadingMessage = useLoadingMessage(LOADING_MESSAGES.INITIAL);

  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <ActivityIndicator
        color={colors.blue}
        size={"large"}
        style={{ marginTop: 48 }}
      />
      <Text style={styles.text}>{loadingMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginTop: 24,
    color: "#333",
    fontStyle: "italic",
    lineHeight: 28,
  },
});

export default LoadingMessages;
