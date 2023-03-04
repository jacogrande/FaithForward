import { AudioControls } from "@src/components/AudioControls";
import useStore from "@src/store";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { Snackbar } from "react-native-paper";

interface ContainerProps {
  children: React.ReactNode;
}

export function Container(props: ContainerProps) {
  const { children } = props;
  const { error, setError } = useStore();

  return (
    <SafeAreaView className="flex-1 bg-ffPaper">
      <View className="flex-1">
        {children}
        <AudioControls />
        <Snackbar
          visible={Boolean(error)}
          onDismiss={() => setError(null)}
          action={{
            label: "Dismiss",
            onPress: () => setError(null),
          }}
        >
          {error}
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}
