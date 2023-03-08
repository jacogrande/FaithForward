import BaseText from "@src/components/ui/BaseText";
import React from "react";
import { View } from "react-native";

export const EmptyFavorites = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 40,
      }}
    >
      <BaseText className="text-ffGrey italic">
        No favorites to display.
      </BaseText>
    </View>
  );
};
