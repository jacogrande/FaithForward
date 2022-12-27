import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../styles/colors";

interface Props {
  keyword: string;
  onPress: () => void;
}

const HeaderChip: React.FC<Props> = ({ keyword, onPress }) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{keyword}</Text>
      <TouchableOpacity style={styles.delete} onPress={onPress}>
        <Text style={[styles.chipText, { color: "#fff", fontSize: 16 }]}>
          {" "}
          &#10007;
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    backgroundColor: colors.blue,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "baseline",
    marginRight: 8,
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  delete: {
    marginLeft: 8,
  },
});

export default HeaderChip;
