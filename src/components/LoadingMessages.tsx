import { LOADING_MESSAGES } from "@src/constants";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import colors from "@src/styles/colors";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import BaseText from "@src/components/ui/BaseText";

const LoadingMessages = () => {
  const loadingMessage = useLoadingMessage(LOADING_MESSAGES.INITIAL);

  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <ActivityIndicator
        color={colors.blue}
        size={"large"}
        style={{ marginTop: 48 }}
      />
      <BaseText className="mt-6">{loadingMessage}</BaseText>
    </View>
  );
};

export default LoadingMessages;
