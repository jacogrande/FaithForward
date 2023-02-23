import React, { useState } from "react";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Text, TouchableOpacity, Share, View } from "react-native";
import { TTradDevo } from "../../types";
import colors from "../styles/colors";
import { formatDate } from "../utils";
import useStore from '../Store'

export function DevotionalCard({ devotional }: { devotional: TTradDevo }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setError } = useStore()

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const favoriteDevo = () => {};

  async function shareDevo () {
    try {
      const result = await Share.share({
        message: `Check out this devotional from Faith Forward!

"${devotional.input}"

Faith Forward:
${devotional.response}`
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
      setError(error.message)
    }
  };

  return (
    <View
      style={{
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 4,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 2,
      }}
    >
      <TouchableOpacity onPress={handleToggleExpanded}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {devotional.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            marginBottom: isExpanded ? 12 : 0,
            fontStyle: "italic",
          }}
        >
          {devotional.input}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="calendar-o" size={20} color="#999" />
          <Text style={{ fontSize: 14, color: "#999", paddingLeft: 10 }}>{formatDate(devotional.createdAt)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={favoriteDevo} style={{ paddingRight: 20 }}>
            <Ionicons name="heart-outline" size={24} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareDevo}>
            <Ionicons name="ios-share-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
      {isExpanded && (
        <>
          <View
            style={{
              borderTopColor: "#eee",
              borderTopWidth: 1,
              paddingTop: 12,
              marginBottom: 12,
              // TODO: Make section more visually distinct
              // TODO: Support verse highlighting and clickthrough actions here
              // TODO: Only have a single devo expanded at a time
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
              {devotional.response}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
