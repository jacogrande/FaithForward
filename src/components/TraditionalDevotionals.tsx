import { logFavoriteDevotional, logUnfavoriteDevotional } from "@src/analytics";
import { Container } from "@src/components/ui/Container";
import { DevotionalCard } from "@src/components/DevotionalCard";
import { Loading } from "@src/components/Loading";
import { auth, favoriteTradDevo, unfavoriteTradDevo } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { useTradDevos } from "@src/hooks/useTradDevos";
import useStore from "@src/store";
import { TTradDevo } from "@src/types";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import BigText from "@src/components/ui/BigText";

function initOptimisticFaves(devos: TTradDevo[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return devos
    .filter((devo: TTradDevo) =>
      devo.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((devo: TTradDevo) => devo.id);
}

export function TraditionalDevotionals() {
  const {
    tradDevos,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = useTradDevos();
  const { setQuietlyRefreshing: setQuietlyRefreshingFaves } =
    useFavorites("devos");
  const [optimisticFaves, setOptimisticFaves] = useState<string[]>(
    initOptimisticFaves(tradDevos)
  );
  const { setError } = useStore();

  useEffect(() => {
    setOptimisticFaves(initOptimisticFaves(tradDevos));
  }, [JSON.stringify(tradDevos)]);

  async function handleFavoritingDevo(devo: TTradDevo) {
    try {
      setOptimisticFaves([...optimisticFaves, devo.id]);
      await favoriteTradDevo(devo);
      logFavoriteDevotional(devo.id, devo.title);
    } catch (err: any) {
      console.warn("Error favoriting devo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }

  async function handleUnfavoritingDevo(devo: TTradDevo) {
    try {
      setOptimisticFaves(optimisticFaves.filter((id) => id !== devo.id));
      await unfavoriteTradDevo(devo);
      logUnfavoriteDevotional(devo.id, devo.title);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <FlatList
        data={tradDevos}
        renderItem={({ item, index }: { item: TTradDevo; index: number }) => (
          <DevotionalCard
            devotional={item}
            faves={optimisticFaves}
            handleFavoritingDevo={handleFavoritingDevo}
            handleUnfavoritingDevo={handleUnfavoritingDevo}
            initExpanded={index === 0}
          />
        )}
        keyExtractor={(item: TTradDevo) => item.id}
        style={{ width: "100%" }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <BigText className="text-ffGrey">No devotions found</BigText>
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
    </Container>
  );
}
