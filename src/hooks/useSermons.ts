import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { TSermon } from "../../types";
import useStore from "../Store";

// TODO: Sort by createdAt
export const useSermons = () => {
  const [sermons, setSermons] = useState<TSermon[]>([]);
  const [loading, setLoading] = useState(true);
  const { setError } = useStore();

  // Fetch sermons from Firestore
  const fetchSermons = async () => {
    console.log("Fetching sermons...");
    try {
      let ss: TSermon[] = [];
      const sermonsQuery = query(collection(db, "sermons"));
      const snapshot = await getDocs(sermonsQuery);
      if (snapshot.empty) {
        console.log("No sermons found.");
      }
      snapshot.forEach((snap: any) => {
        ss.push({ id: snap.id, ...snap.data() });
      });
      setSermons(ss);
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  return { sermons, loading };
};