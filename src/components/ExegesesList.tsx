import { ExegesisCard } from "@src/components/ExegesisCard";
import { TExegesis } from "@src/types";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export function ExegesesList({
  exegeses,
  faves,
  handleFavoritingExegesis,
  handleUnfavoritingExegesis,
  refreshing,
  onRefresh,
}: {
  exegeses: TExegesis[];
  faves: string[];
  handleFavoritingExegesis: ((exegesis: TExegesis) => void) | null;
  handleUnfavoritingExegesis: (exegesis: TExegesis) => void;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      data={exegeses}
      renderItem={({ item }: { item: TExegesis }) => (
        <ExegesisCard
          exegesis={item}
          faves={faves}
          handleFavoritingExegesis={handleFavoritingExegesis}
          handleUnfavoritingExegesis={handleUnfavoritingExegesis}
        />
      )}
      keyExtractor={(item: any) => item.id}
      style={{ width: "100%" }}
      ListEmptyComponent={() => (
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <Text style={{ fontSize: 18, color: "#999" }}>No exegeses found</Text>
        </View>
      )}
      ListFooterComponent={() => <View style={{ height: 48 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
