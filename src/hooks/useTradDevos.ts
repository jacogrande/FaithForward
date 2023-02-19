import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { TTradDevo } from "../../types";
import useStore from "../Store";

type Signature = {
  tradDevos: TTradDevo[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
};

export const useTradDevos = (): Signature => {
  const [tradDevos, setTradDevos] = useState<TTradDevo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { setError } = useStore();

  // Fetch tradDevos from Firestore
  const fetchTradDevos = async () => {
    console.log("Fetching tradDevos...");
    try {
      let devos: TTradDevo[] = [];
      const tradDevosQuery = query(collection(db, "devotionals"));
      const snapshot = await getDocs(tradDevosQuery);
      if (snapshot.empty) {
        console.log("No tradDevos found.");
      }
      snapshot.forEach((snap: any) => {
        devos.push({ id: snap.id, ...snap.data() });
      });
      setTradDevos(devos);
    } catch (error: any) {
      console.error(error);
      setError(error.message || error.toString());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading || refreshing) {
      fetchTradDevos();
    }
  }, [refreshing]);

  return { tradDevos, loading, refreshing, setRefreshing };
};
