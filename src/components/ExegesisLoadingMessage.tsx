import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import React from "react";
import { View } from "react-native";
import SmallText from "@src/components/ui/SmallText";

export function ExegesisLoadingMessage() {
  const loadingMessage = useLoadingMessage("Writing analysis");

  return (
    <View
      className="flex-1 justify-end items-end mb-5"
      style={{ marginHorizontal: "12%" }}
    >
      <SmallText className="italic">{loadingMessage}</SmallText>
    </View>
  );
}
