import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { auth, favoriteTradDevo, unfavoriteTradDevo } from "../../firebase";
import { usePastDevos } from "../hooks/usePastDevos";
import useStore from "../Store";
import { DevotionalCard } from "../components/DevotionalCard";

function initOptimisticFaves(devos: any[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return devos
    .filter((devo: any) =>
      devo.favoritedBy?.includes(auth.currentUser?.uid || "")
    )
    .map((devo: any) => devo.id);
}

// TODO: Scroll the newly expanded devotional into view
export function PastDevotionals() {
  const [expandedDevoId, setExpandedDevoId] = useState<string | null>(null);
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

  // TODO: Unstub
  async function handleFavoritingDevo(devo: any) {
    /* try { */
    /*   setOptimisticFaves([...optimisticFaves, devo.id]); */
    /*   await favoriteTradDevo(devo); */
    /*   setQuietlyRefreshing(true); */
    /* } catch (err: any) { */
    /*   console.warn("Error favoriting devo:"); */
    /*   console.error(err); */
    /*   setError(err.message); */
    /* } */
  }

  // TODO: Unstub
  async function handleUnfavoritingDevo(devo: any) {
    /* try { */
    /*   setOptimisticFaves(optimisticFaves.filter((id) => id !== devo.id)); */
    /*   await unfavoriteTradDevo(devo); */
    /*   setQuietlyRefreshing(true); */
    /* } catch (err: any) { */
    /*   console.warn("Error unfavoriting devo:"); */
    /*   console.error(err); */
    /*   setError(err.message); */
    /* } */
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={pastDevos}
        renderItem={({ item }: { item: any }) => (
          <DevotionalCard
            devotional={item}
            isExpanded={item.id === expandedDevoId}
            onPress={() =>
              setExpandedDevoId(expandedDevoId === item.id ? null : item.id)
            }
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
    </View>
  );
}
