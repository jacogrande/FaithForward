import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../styles/colors";

interface Props {
  keyword: string;
  onPress: () => void;
  active?: boolean;
}

const KeywordChip: React.FC<Props> = ({ keyword, onPress, active }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chip, active && styles.activeChip]}>
        <Text
          style={[
            styles.chipText,
            active && { color: "#fff", fontWeight: "bold" },
          ]}
        >
          {keyword}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.darkPaper,
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  activeChip: {
    backgroundColor: colors.blue,
  },
  chipText: {
    fontSize: 18,
    color: "#222",
  },
});

export default KeywordChip;
