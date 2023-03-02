import { auth, db } from "@src/firebase";
import useStore, { useContentStore } from "@src/store";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  pastExegeses: any[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const usePastExegeses = (): Signature => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();
  const { pastExegeses, setPastExegeses } = useContentStore();

  // Fetch pastExegeses from Firestore
  const fetchPastExegeses = async () => {
    try {
      // Get user ref
      if (!auth.currentUser) {
        console.warn("No user found.");
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);

      let exegeses: any[] = [];
      const pastExegesesQuery = query(
        collection(userRef, "exegeses"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(pastExegesesQuery);
      if (snapshot.empty) {
        console.log("No pastExegeses found.");
      }
      snapshot.forEach((snap: any) => {
        exegeses.push({ id: snap.id, ...snap.data() });
      });
      setPastExegeses(exegeses);
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
      fetchPastExegeses();
    }
  }, [refreshing, quietlyRefreshing]);

  return {
    pastExegeses,
    loading,
    refreshing,
    setRefreshing,
    quietlyRefreshing,
    setQuietlyRefreshing,
  };
};
