import { logUnfavoriteVerse } from "@src/analytics";
import { Loading } from "@src/components/Loading";
import { VersesList } from "@src/components/VersesList";
import { unfavoriteVerse } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import useStore from "@src/store";
import React, { useEffect, useState } from "react";

export function FavoriteVerses() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("verses");
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
    setFavoriteVerses(
      favorites
        .filter((fave) => fave.type === "verse")
        .sort((a, b) => {
          // Sort by createdAt
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return 0;
        })
        .map((fave) => ({ ...fave.docData }))
    );
    setQuietlyRefreshing(true);
  }, [JSON.stringify(favorites)]);

  async function handleUnfavoritingVerse(
    book: string,
    chapter: number,
    verseNumber: number
  ): Promise<void> {
    try {
      setFavoriteVerses(
        favoriteVerses.filter(
          (fave) =>
            fave.book !== book &&
            fave.chapter !== chapter &&
            fave.verseNumber !== verseNumber
        )
      );
      logUnfavoriteVerse(book, chapter, verseNumber);
      await unfavoriteVerse("kjv", book, chapter, verseNumber);
    } catch (err: any) {
      console.warn("Error unfavoriting verse:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
    }
  }

  if (loading) return <Loading />;

  return (
    <VersesList
      verses={favoriteVerses}
      handleUnfavoritingVerse={handleUnfavoritingVerse}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}
