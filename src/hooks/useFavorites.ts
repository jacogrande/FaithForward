import { auth, db } from "@src/firebase";
import useStore, { useContentStore } from "@src/store";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

type Signature = {
  favorites: any[];
  loading: boolean;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  quietlyRefreshing: boolean;
  setQuietlyRefreshing: (quietlyRefreshing: boolean) => void;
};

type FaveType = "devos" | "verses" | "sermons" | "exegeses";

export const useFavorites = (faveType?: FaveType): Signature => {
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
      let favoritesQuery: any;

      switch (faveType) {
        case "devos":
          favoritesQuery = query(
            collection(userRef, "favorites"),
            where("type", "in", ["personalDevo", "tradDevo"]),
            orderBy("createdAt", "desc")
          );
          break;
        case "verses":
          favoritesQuery = query(
            collection(userRef, "favorites"),
            where("type", "==", "verse"),
            orderBy("createdAt", "desc")
          );
          break;
        case "sermons":
          favoritesQuery = query(
            collection(userRef, "favorites"),
            where("type", "==", "sermon"),
            orderBy("createdAt", "desc")
          );
          break;
        case "exegeses":
          favoritesQuery = query(
            collection(userRef, "favorites"),
            where("type", "==", "exegesis"),
            orderBy("createdAt", "desc")
          );
          break;
        default:
          favoritesQuery = query(
            collection(userRef, "favorites"),
            orderBy("createdAt", "desc")
          );
          break;
      }

      if (!favoritesQuery) {
        console.warn("No favorites query was set.");
        return;
      }

      const favoritesQuerySnap = await getDocs(favoritesQuery);
      const faves = favoritesQuerySnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as object),
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
