import { auth, db } from "@src/firebase";
import useStore, { useContentStore } from "@src/store";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  favorites: any[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const useFavorites = (): Signature => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();
  const { favorites, setFavorites } = useContentStore();

  // Fetch favorites from Firestore
  const fetchFavorites = async () => {
    try {
      if (!auth.currentUser) {
        console.warn("No user is logged in.");
        return;
      }

      // Get favorites
      const userRef = doc(db, "users", auth.currentUser.uid);
      const favoritesQuery = query(
        collection(userRef, "favorites"),
        orderBy("createdAt", "desc")
      );
      const favoritesQuerySnap = await getDocs(favoritesQuery);
      const faves = favoritesQuerySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(faves);
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
    } finally {
      setLoading(false);
      setRefreshing(false);
      setQuietlyRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading || refreshing || quietlyRefreshing) {
      fetchFavorites();
    }
  }, [refreshing, quietlyRefreshing]);

  return {
    favorites,
    loading,
    refreshing,
    setRefreshing,
    quietlyRefreshing,
    setQuietlyRefreshing,
  };
};
