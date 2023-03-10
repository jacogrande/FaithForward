import BaseText from "@src/components/ui/BaseText";
import { VerseCard } from "@src/components/VerseCard";
import { useFavorites } from "@src/hooks/useFavorites";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

// TODO: Handle fave/unfave states here
export function VersesList({
  verses,
  refreshing,
  onRefresh,
  handleEndReached,
}: {
  verses: any[];
  refreshing: boolean;
  onRefresh: () => void;
  handleEndReached: () => void;
}) {
  const { favorites, setQuietlyRefreshing } = useFavorites({
    fetch: true,
    faveType: "verses",
  });

  const favoriteVerses =
    favorites?.filter((fave) => fave.type === "verse") || [];

  const handleFaveToggle = () => {
    setQuietlyRefreshing(true);
  };

  return (
    <FlatList
      data={verses}
      renderItem={({ item: verse }: { item: any }) => (
        <VerseCard
          book={verse.book}
          chapter={verse.chapter}
          verseNumber={verse.verseNumber}
          verse={verse.verse}
          favorited={favoriteVerses.some(
            (fave) =>
              fave.docData.book === verse.book &&
              fave.docData.chapter === parseInt(verse.chapter) &&
              fave.docData.verseNumber === parseInt(verse.verseNumber)
          )}
          onFaveToggle={handleFaveToggle}
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
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
