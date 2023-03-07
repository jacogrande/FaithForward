import { ExegesisCard } from "@src/components/ExegesisCard";
import { TExegesis } from "@src/types";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import BaseText from "@src/components/ui/BaseText";
import BigText from "@src/components/ui/BigText";

export function ExegesesList({
  exegeses,
  faves,
  handleFavoritingExegesis,
  handleUnfavoritingExegesis,
  refreshing,
  onRefresh,
  expandFirst,
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
      renderItem={({ item, index }: { item: TExegesis; index: number }) => (
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
        <View
          style={{
            alignItems: "center",
            marginTop: 24,
            marginHorizontal: "15%",
          }}
        >
          <BigText className="text-ffGrey">No exegeses found</BigText>
          <BaseText className="text-ffGrey mt-8">
            Get one by tapping a Bible verse and then tapping the scroll icon.
          </BaseText>
        </View>
      )}
      ListFooterComponent={() => <View style={{ height: 48 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
