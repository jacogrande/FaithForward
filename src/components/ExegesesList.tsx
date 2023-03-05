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
  expandFirst
}: {
  exegeses: TExegesis[];
  faves: string[];
  handleFavoritingExegesis: ((exegesis: TExegesis) => void) | null;
  handleUnfavoritingExegesis: (exegesis: TExegesis) => void;
  refreshing: boolean;
  onRefresh: () => void;
  expandFirst?: boolean;
}) {
  return (
    <FlatList
      data={exegeses}
      renderItem={({ item, index }: { item: TExegesis, index: number }) => (
        <ExegesisCard
          exegesis={item}
          faves={faves}
          handleFavoritingExegesis={handleFavoritingExegesis}
          handleUnfavoritingExegesis={handleUnfavoritingExegesis}
          initExpanded={expandFirst && index === 0}
        />
      )}
      keyExtractor={(item: any) => item.id}
      style={{ width: "100%" }}
      ListEmptyComponent={() => (
        <View style={{ alignItems: "center", marginTop: 24, marginHorizontal: '15%' }}>
          <Text style={{ fontSize: 18, color: "#999" }}>No exegeses found</Text>
          <Text style={{ fontSize: 16, color: "#999", marginTop: 20 }}>Get one by tapping a Bible verse and then tapping the scroll icon.</Text>
        </View>
      )}
      ListFooterComponent={() => <View style={{ height: 48 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
