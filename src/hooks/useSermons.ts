import { db } from "@src/firebase";
import useStore from "@src/Store";
import { TSermon } from "@src/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  sermons: TSermon[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const useSermons = (): Signature => {
  const [sermons, setSermons] = useState<TSermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();

  // Fetch sermons from Firestore
  const fetchSermons = async () => {
    console.log("Fetching sermons...");
    try {
      let ss: TSermon[] = [];
      const sermonsQuery = query(
        collection(db, "sermons"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(sermonsQuery);
      if (snapshot.empty) {
        console.log("No sermons found.");
      }
      snapshot.forEach((snap: any) => {
        ss.push({
          id: snap.id,
          ...snap.data(),
        });
      });
      setSermons(ss);
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setQuietlyRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading || refreshing || quietlyRefreshing) {
      fetchSermons();
    }
  }, [refreshing, quietlyRefreshing]);

  return {
    sermons,
    loading,
    refreshing,
    setRefreshing,
    quietlyRefreshing,
    setQuietlyRefreshing,
  };
};
