import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { auth, favoriteTradDevo, unfavoriteTradDevo } from "../../firebase";
import { TTradDevo } from "../../types";
import { useTradDevos } from "../hooks/useTradDevos";
import useStore from "../Store";
import { Container } from "./Container";
import { DevotionalCard } from "./DevotionalCard";

// TODO: Why are optimisticFaves returning a devo that has been unfavorited?
function initOptimisticFaves(devos: TTradDevo[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return devos
    .filter((devo: TTradDevo) =>
      devo.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((devo: TTradDevo) => devo.id);
}

// TODO: Scroll the newly expanded devotional into view
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
        style={{ width: "100%", paddingHorizontal: 20 }}
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
