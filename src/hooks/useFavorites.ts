import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import useStore from "../Store";

type Signature = {
  favorites: any[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

export const useFavorites = (): Signature => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quietlyRefreshing, setQuietlyRefreshing] = useState(false);
  const { setError } = useStore();

  // Fetch favorites from Firestore
  const fetchFavorites = async () => {
    console.log("Fetching favorites...");
    try {
      if (!auth.currentUser) {
        console.warn("No user is logged in.");
        return;
      }

      // Get current user doc
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDoc);
      if (!userDocSnap.exists()) {
        console.warn("No user found.");
        return;
      }

      // Get favorites
      const favoritesQuery = query(
        collection(userDoc, "favorites"),
        orderBy("createdAt", "desc")
      );
      const favoritesQuerySnap = await getDocs(favoritesQuery);
      const favorites = favoritesQuerySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favorites);
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
    } finally {
      setLoading(false);
      setRefreshing(false);
      setQuietlyRefreshing(false)
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
