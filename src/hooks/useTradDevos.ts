import { db } from "@src/firebase";
import useStore, { useContentStore } from "@src/store";
import { TTradDevo } from "@src/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  tradDevos: TTradDevo[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const useTradDevos = (): Signature => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();
  const { tradDevos, setTradDevos } = useContentStore();

  // Fetch tradDevos from Firestore
  const fetchTradDevos = async () => {
    try {
      let devos: TTradDevo[] = [];
      const tradDevosQuery = query(
        collection(db, "devotionals"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(tradDevosQuery);
      if (snapshot.empty) {
        console.log("No tradDevos found.");
      }
      snapshot.forEach((snap: any) => {
        devos.push({ id: snap.id, ...snap.data() });
      });
      setTradDevos(devos);
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
      fetchTradDevos();
    }
  }, [refreshing, quietlyRefreshing]);

  return {
    tradDevos,
    loading,
    refreshing,
    setRefreshing,
    quietlyRefreshing,
    setQuietlyRefreshing,
  };
};
