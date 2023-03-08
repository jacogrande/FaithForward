import { logUnfavoriteExegesis } from "@src/analytics";
import { ExegesesList } from "@src/components/ExegesesList";
import { Loading } from "@src/components/Loading";
import { unfavoriteExegesis } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import useStore from "@src/store";
import { TExegesis } from "@src/types";
import React, { useEffect, useState } from "react";

export function FavoriteExegeses() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites({ fetch: true, faveType: "exegeses" });
  const { setQuietlyRefreshing: setQuietlyRefreshingPastExegeses } =
    usePastExegeses();
  const [favoriteExegeses, setFavoriteExegeses] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
    setFavoriteExegeses(
      favorites
        .filter((fave) => fave.type === "exegesis")
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
    setQuietlyRefreshingPastExegeses(true);
  }, [JSON.stringify(favorites)]);

  async function handleUnfavoritingExegesis(exegesis: TExegesis) {
    try {
      setFavoriteExegeses(
        favoriteExegeses.filter((fave) => fave.id !== exegesis.id)
      );
      logUnfavoriteExegesis(
        exegesis.id,
        exegesis.book || "",
        exegesis.chapter || 0,
        exegesis.verseNumber || 0
      );
      await unfavoriteExegesis(exegesis);
    } catch (err: any) {
      console.warn("Error unfavoriting exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingPastExegeses(true);
    }
  }

  if (loading) return <Loading />;

  return (
    <ExegesesList
      exegeses={favoriteExegeses}
      faves={favoriteExegeses.map((fave) => fave.id)}
      handleUnfavoritingExegesis={handleUnfavoritingExegesis}
      handleFavoritingExegesis={null}
      refreshing={refreshing}
      onRefresh={() => setRefreshing(true)}
    />
  );
}
