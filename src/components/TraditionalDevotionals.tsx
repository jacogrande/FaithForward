import { logFavoriteDevotional } from "@src/analytics";
import { Container } from "@src/components/Container";
import { DevotionalCard } from "@src/components/DevotionalCard";
import { auth, favoriteTradDevo, unfavoriteTradDevo } from "@src/firebase";
import { useTradDevos } from "@src/hooks/useTradDevos";
import useStore from "@src/store";
import { TTradDevo } from "@src/types";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

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
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error favoriting devo:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingDevo(devo: TTradDevo) {
    try {
      setOptimisticFaves(optimisticFaves.filter((id) => id !== devo.id));
      await unfavoriteTradDevo(devo);
      logFavoriteDevotional(devo.id, devo.title, false);
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error unfavoriting devo:");
      console.error(err);
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Container>
      <FlatList
        data={tradDevos}
        renderItem={({ item }: { item: TTradDevo }) => (
          <DevotionalCard
            devotional={item}
            faves={optimisticFaves}
            handleFavoritingDevo={handleFavoritingDevo}
            handleUnfavoritingDevo={handleUnfavoritingDevo}
          />
        )}
        keyExtractor={(item: TTradDevo) => item.id}
        style={{ width: "100%" }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 18, color: "#999" }}>
              No devotions found
            </Text>
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
