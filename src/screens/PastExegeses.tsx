import { Container } from "@src/components/ui/Container";
import { ExegesesList } from "@src/components/ExegesesList";
import { Loading } from "@src/components/Loading";
import { favoriteExegesis, unfavoriteExegesis } from "@src/firebase";
import { useFavorites } from "@src/hooks/useFavorites";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import useStore from "@src/store";
import { TExegesis } from "@src/types";
import React, { useEffect, useState } from "react";

function initOptimisticFaves(exegeses: any[]): string[] {
  // Return an array of sermon IDs that are favoritedBy the current user
  return exegeses
    .filter((exegesis: any) => exegesis.favorited)
    .map((exegesis: any) => exegesis.id);
}

export function PastExegeses({ route }: { route: any }) {
  const {
    pastExegeses,
    loading,
    refreshing,
    setRefreshing,
    setQuietlyRefreshing,
  } = usePastExegeses();
  const { setQuietlyRefreshing: setQuietlyRefreshingFaves } =
    useFavorites("exegeses");
  const [optimisticFaves, setOptimisticFaves] = useState<string[]>(
    initOptimisticFaves(pastExegeses)
  );
  const { setError } = useStore();

  useEffect(() => {
    setOptimisticFaves(initOptimisticFaves(pastExegeses));
  }, [JSON.stringify(pastExegeses)]);

  async function handleFavoritingExegesis(exegesis: TExegesis) {
    try {
      setOptimisticFaves([...optimisticFaves, exegesis.id]);
      await favoriteExegesis(exegesis);
    } catch (err: any) {
      console.warn("Error favoriting exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setQuietlyRefreshing(true);
      setQuietlyRefreshingFaves(true);
    }
  }

  async function handleUnfavoritingExegesis(exegesis: TExegesis) {
    try {
      setOptimisticFaves(optimisticFaves.filter((id) => id !== exegesis.id));
      await unfavoriteExegesis(exegesis);
    } catch (err: any) {
      console.warn("Error unfavoriting exegesis:");
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
      <ExegesesList
        exegeses={pastExegeses}
        faves={optimisticFaves}
        handleFavoritingExegesis={handleFavoritingExegesis}
        handleUnfavoritingExegesis={handleUnfavoritingExegesis}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        expandFirst={route.params?.expandFirst || false}
      />
    </Container>
  );
}
