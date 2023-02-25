import { auth, db } from "@src/firebase";
import useStore from "@src/store";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  pastDevos: any[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const usePastDevos = (): Signature => {
  const [pastDevos, setPastDevos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();

  // Fetch pastDevos from Firestore
  const fetchPastDevos = async () => {
    console.log("Fetching pastDevos...");
    try {
      // Get user ref
      if (!auth.currentUser) {
        console.warn("No user found.");
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);

      let devos: any[] = [];
      const pastDevosQuery = query(
        collection(userRef, "prompts"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(pastDevosQuery);
      if (snapshot.empty) {
        console.log("No pastDevos found.");
      }
      snapshot.forEach((snap: any) => {
        devos.push({ id: snap.id, ...snap.data() });
      });
      setPastDevos(devos);
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
      fetchPastDevos();
    }
  }, [refreshing, quietlyRefreshing]);

  return {
    pastDevos,
    loading,
    refreshing,
    setRefreshing,
    quietlyRefreshing,
    setQuietlyRefreshing,
  };
};
