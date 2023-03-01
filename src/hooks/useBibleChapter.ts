import { db } from "@src/firebase";
import useStore from "@src/store";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useBibleChapter(book: string, chapter: number) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useStore();

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "bibles", "kjv", "books", book, "chapters")
      );
      const querySnapshot = await getDocs(q);

      // Get all the chapters
      const chapters = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      // Get the chapter we're looking for
      const chapterData = chapters.find((c) => c.id === chapter.toString());
      if (!chapterData) {
        throw new Error(`Chapter ${chapter} not found in book ${book}`);
      }

      // Convert data object into array, ordered by Number(key)
      const verses = Object.keys(chapterData.data).map(
        (key) => chapterData.data[key]
      );
      setData(verses);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (book && chapter) {
      fetchChapter();
    }
  }, [book, chapter]);

  return { isLoading, data };
}
