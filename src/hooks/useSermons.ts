import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { TSermon } from "../../types";
import useStore from "../Store";

// TODO: Add silent refresh handling
type Signature = {
  sermons: TSermon[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
};

export const useSermons = (): Signature => {
  const [sermons, setSermons] = useState<TSermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
          ...snap.data()
        });
      });
      setSermons(ss);
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading || refreshing) {
      fetchSermons();
    }
  }, [refreshing]);

  return { sermons, loading, refreshing, setRefreshing };
};
