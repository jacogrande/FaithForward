import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import colors from "@src/styles/colors";
import { FaveViewType } from "@src/types";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export function FavoritesFilters({
  viewType,
  onPressFilter,
}: {
  viewType: FaveViewType;
  onPressFilter: (viewType: FaveViewType) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginVertical: 24,
      }}
    >
      <TouchableOpacity
        onPress={() => onPressFilter("devos")}
        className={`px-6 py-2  rounded-full ${
          viewType === "devos" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <Ionicons
          name="md-sunny"
          size={24}
          color={viewType === "devos" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("verses")}
        className={`px-6 py-2  rounded-full ${
          viewType === "verses" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <Ionicons
          name="book"
          size={24}
          color={viewType === "verses" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("sermons")}
        className={`px-6 py-2  rounded-full ${
          viewType === "sermons" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <FontAwesome5
          name="church"
          size={24}
          color={viewType === "sermons" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onPressFilter("exegeses")}
        className={`px-6 py-2  rounded-full ${
          viewType === "exegeses" ? "bg-ffBlue" : "bg-ffDarkPaper"
        }`}
      >
        <FontAwesome5
          name="scroll"
          size={24}
          color={viewType === "exegeses" ? colors.paper : colors.blue}
        />
      </TouchableOpacity>
    </View>
  );
}
