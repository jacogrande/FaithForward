import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import {
  getRandomMessage,
  initialLoadingMessage,
} from "../data/loadingMessages";
import colors from "../styles/colors";

const LoadingScreen = () => {
  const [ellipsis, setEllipsis] = useState("   ");
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState(initialLoadingMessage);

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter === 0) {
        setEllipsis("   ");
        setCounter(counter + 1);
      } else if (counter === 1) {
        setEllipsis(".  ");
        setCounter(counter + 1);
      } else if (counter === 2) {
        setEllipsis(".. ");
        setCounter(counter + 1);
      } else if (counter === 3) {
        setEllipsis("...");
        setCounter(0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(getRandomMessage());
    }, 5000);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <ActivityIndicator
        color={colors.blue}
        size={"large"}
        style={{ marginTop: 48 }}
      />
      <Text style={styles.text}>
        {message} {ellipsis}
      </Text>
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

export default LoadingScreen;
