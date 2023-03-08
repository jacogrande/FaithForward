import { logUnfavoriteDevotional } from "@src/analytics";
import { DevotionalCard } from "@src/components/DevotionalCard";
import { EmptyFavorites } from "@src/components/EmptyFavorites";
import { Loading } from "@src/components/Loading";
import { unfavoritePersonalDevo, unfavoriteTradDevo } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastDevos } from "@src/hooks/usePastDevos";
import { useTradDevos } from "@src/hooks/useTradDevos";
import useStore from "@src/store";
import { TPersonalDevo, TTradDevo } from "@src/types";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

export function FavoriteDevos() {
  const {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useFavorites("devos");
  const { setQuietlyRefreshing: setQuietlyRefreshingTradDevos } =
    useTradDevos();
  const { setQuietlyRefreshing: setQuietlyRefreshingPastDevos } =
    usePastDevos();
  const [favoriteDevos, setFavoriteDevos] = useState<any[]>([]);
  const { setError } = useStore();

  // Set favorites when favorites updates
  useEffect(() => {
    setFavoriteDevos(
      favorites
        .filter(
          (fave) => fave.type === "tradDevo" || fave.type === "personalDevo"
        )
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
    setQuietlyRefreshingPastDevos(true);
    setQuietlyRefreshingTradDevos(true);
  }, [JSON.stringify(favorites)]);

  async function handleUnfavoritingDevo(devo: TTradDevo | TPersonalDevo) {
    const fave = favorites.find((fave) => fave.docId === devo.id);

    switch (fave?.type) {
      case "tradDevo":
        handleUnfavoritingTradDevo(devo as TTradDevo);
        break;
      case "personalDevo":
        handleUnfavoritingPersonalDevo(devo as TPersonalDevo);
        break;
      default:
        console.warn("Error unfavoriting devo: fave.type is not valid");
        break;
    }
  }

  async function handleUnfavoritingTradDevo(tradDevo: TTradDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== tradDevo.id));
      logUnfavoriteDevotional(tradDevo.id, tradDevo.title);
      await unfavoriteTradDevo(tradDevo);
    } catch (err: any) {
      console.warn("Error unfavoriting tradDevo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingTradDevos(true);
    }
  }

  async function handleUnfavoritingPersonalDevo(devo: TPersonalDevo) {
    try {
      setFavoriteDevos(favoriteDevos.filter((fave) => fave.id !== devo.id));
      logUnfavoriteDevotional(devo.id, "Personal Devo");
      await unfavoritePersonalDevo(devo);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingPastDevos(true);
    }
  }

  function stub() {}

  const faves = favoriteDevos.map((fave) => fave.id);

  if (loading) return <Loading />;

  return (
    <FlatList
      data={favoriteDevos}
      renderItem={({ item: devo }: { item: any }) => (
        <DevotionalCard
          devotional={devo}
          faves={faves}
          handleFavoritingDevo={stub}
          handleUnfavoritingDevo={handleUnfavoritingDevo}
        />
      )}
      keyExtractor={(item) => item.id}
      style={{ height: "100%" }}
      ListEmptyComponent={<EmptyFavorites />}
      ListFooterComponent={<View style={{ height: 100 }} />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    />
  );
}
