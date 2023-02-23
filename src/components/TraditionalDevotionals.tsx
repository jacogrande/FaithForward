import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { TTradDevo } from "../../types";
import { useTradDevos } from "../hooks/useTradDevos";
import { DevotionalCard } from "./DevotionalCard";

// TODO: Scroll the newly expanded devotional into view
export function TraditionalDevotionals() {
  const [expandedDevoId, setExpandedDevoId] = useState<string | null>(null);
  const { tradDevos, loading, refreshing, setRefreshing } = useTradDevos();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={tradDevos}
        renderItem={({ item }: { item: TTradDevo }) => (
          <DevotionalCard
            devotional={item}
            isExpanded={item.id === expandedDevoId}
            onPress={() => setExpandedDevoId(expandedDevoId === item.id ? null : item.id)}
          />
        )}
        keyExtractor={(item: TTradDevo) => item.id}
        style={{ width: "100%", paddingHorizontal: 20 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 18, color: "#999" }}>
              No devotions found
            </Text>
          </View>
        )}
        ListFooterComponent={() => <View style={{ height: 48 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
    </View>
  );
}
