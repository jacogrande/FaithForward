import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useTradDevos } from "../hooks/useTradDevos";
import { DevotionalCard } from "./DevotionalCard";

export function TraditionalDevotionals() {
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
        renderItem={({ item }) => <DevotionalCard devotional={item} />}
        keyExtractor={(item) => item.id}
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
