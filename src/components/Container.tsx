import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import colors from "../styles/colors";

interface ContainerProps {
  children: React.ReactNode;
}

export function Container(props: ContainerProps) {
  const { children } = props;

  return (
    <SafeAreaView style={styles.superContainer}>
      <View style={styles.subContainer}>{children}</View>
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
