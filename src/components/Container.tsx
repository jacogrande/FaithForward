import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Snackbar } from "react-native-paper";
import useStore from "../Store";
import colors from "../styles/colors";
import { AudioControls } from "./AudioControls";

interface ContainerProps {
  children: React.ReactNode;
}

export function Container(props: ContainerProps) {
  const { children } = props;
  const { error, setError } = useStore();

  return (
    <SafeAreaView style={styles.superContainer}>
      <View style={styles.subContainer}>
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

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  subContainer: {
    flex: 1,
  },
});
