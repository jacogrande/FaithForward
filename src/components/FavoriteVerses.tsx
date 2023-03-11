import { Loading } from "@src/components/Loading";
import { VersesList } from "@src/components/VersesList";
import { useFavorites } from "@src/hooks/useFavorites";
import React, { useEffect, useState } from "react";

export function FavoriteVerses() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites({ fetch: true, faveType: "verses" });
  const [favoriteVerses, setFavoriteVerses] = useState<any[]>([]);

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

  if (loading) return <Loading />;

  return (
    <VersesList
      verses={favoriteVerses}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}
