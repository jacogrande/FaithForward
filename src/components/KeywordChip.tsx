import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../styles/colors";

interface Props {
  keyword: string;
  onPress: () => void;
}

const KeywordChip: React.FC<Props> = ({ keyword, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{keyword}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.darkPaper,
    borderRadius: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#222",
  },
});

export default KeywordChip;
