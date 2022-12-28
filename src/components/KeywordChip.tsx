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
        <Text style={[styles.chipText, active && { color: "#fff" }]}>
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
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 16,
    marginVertical: 4,
  },
  activeChip: {
    backgroundColor: colors.blue,
  },
  chipText: {
    fontSize: 14,
    color: "#444",
    // fontWeight: "600",
  },
});

export default KeywordChip;
