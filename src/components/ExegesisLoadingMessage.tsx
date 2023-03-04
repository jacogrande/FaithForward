import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import React from "react";
import { Text, View } from "react-native";

export function ExegesisLoadingMessage() {
  const loadingMessage = useLoadingMessage("Writing exegesis");

  return (
    <View
      className="flex-1 justify-end items-end mb-5"
      style={{ marginHorizontal: "12%" }}
    >
      <Text className="color-ffBlack italic">{loadingMessage}</Text>
    </View>
  );
}
