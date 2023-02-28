import colors from "@src/styles/colors";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-ffPaper">
      <ActivityIndicator size="large" color={colors.blue} />
    </View>
  );
}
