import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { favoritePersonalDevo, unfavoritePersonalDevo } from "../../firebase";
import { TPersonalDevo } from "../../types";
import { Container } from "../components/Container";
import { DevotionalCard } from "../components/DevotionalCard";
import { usePastDevos } from "../hooks/usePastDevos";
import useStore from "../Store";

function initOptimisticFaves(devos: TPersonalDevo[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return devos
    .filter((devo: TPersonalDevo) => devo.favorited)
    .map((devo: TPersonalDevo) => devo.id);
}

// TODO: Scroll the newly expanded devotional into view
export function PastDevotionals() {
  const {
    pastDevos,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = usePastDevos();
  const [optimisticFaves, setOptimisticFaves] = useState<string[]>(
    initOptimisticFaves(pastDevos)
  );
  const { setError } = useStore();

  useEffect(() => {
    setOptimisticFaves(initOptimisticFaves(pastDevos));
  }, [JSON.stringify(pastDevos)]);

  async function handleFavoritingDevo(devo: TPersonalDevo) {
    try {
      setOptimisticFaves([...optimisticFaves, devo.id]);
      await favoritePersonalDevo(devo);
      setQuietlyRefreshing(true);
    } catch (err: any) {
      console.warn("Error favoriting devo:");
      console.error(err);
      setError(err.message);
    }
  }

  async function handleUnfavoritingDevo(devo: TPersonalDevo) {
    try {
      setOptimisticFaves(optimisticFaves.filter((id) => id !== devo.id));
      await unfavoritePersonalDevo(devo);
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
        data={pastDevos}
        renderItem={({ item }: { item: TPersonalDevo }) => (
          <DevotionalCard
            devotional={item}
            faves={optimisticFaves}
            handleFavoritingDevo={handleFavoritingDevo}
            handleUnfavoritingDevo={handleUnfavoritingDevo}
          />
        )}
        keyExtractor={(item: any) => item.id}
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
