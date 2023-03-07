import { VerseCard } from "@src/components/VerseCard";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import BaseText from "./ui/BaseText";

export function VersesList({
  verses,
  handleUnfavoritingVerse,
  refreshing,
  onRefresh,
}: {
  verses: any[];
  handleUnfavoritingVerse: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => void;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      data={verses}
      renderItem={({ item: verse }: { item: any }) => (
        <VerseCard
          book={verse.book}
          chapter={verse.chapter}
          verseNumber={verse.verseNumber}
          verse={verse.verse}
          handleUnfavoritingVerse={handleUnfavoritingVerse}
        />
      )}
      keyExtractor={(item) => `${item.book}${item.chapter}${item.verseNumber}`}
      style={{ height: "100%" }}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 40,
          }}
        >
          <BaseText className="text-ffGrey">No verses to display.</BaseText>
        </View>
      }
      ListFooterComponent={<View style={{ height: 100 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
