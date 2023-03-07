import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@src/firebase";
import useStore from "@src/store";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const MAX_LOCAL_CHAPTERS = 3;

async function getLocalChapter(
  book: string,
  chapter: number
): Promise<any[] | null> {
  // Check if we have the chapters for this book in local storage
  const localChapters = await AsyncStorage.getItem(`${book}-chapters`);
  if (localChapters) {
    // Get the chapter we're looking for
    const chapterData = JSON.parse(localChapters).data.find(
      (c: any) => c.id === chapter.toString()
    );
    if (!chapterData) {
      throw new Error(`Chapter ${chapter} not found in book ${book}`);
    }

    // Convert data object into array, ordered by Number(key)
    const verses = Object.keys(chapterData.data).map(
      (key) => chapterData.data[key]
    );
    return verses;
  }

  return null;
}

async function clearOldestLocalBook(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const books = keys.filter((key) => key.endsWith("-chapters"));
  if (books.length > MAX_LOCAL_CHAPTERS) {
    // Get all the books and their added dates
    const bookDates = await Promise.all(
      books.map(async (book) => {
        const data = await AsyncStorage.getItem(book);
        return { book, added: new Date(JSON.parse(data || "").added) };
      })
    );

    // Remove the oldest book
    const oldestBook = bookDates.sort(
      (a, b) => a.added.getTime() - b.added.getTime()
    )[0];
    await AsyncStorage.removeItem(oldestBook.book);
  }
}

export function useBibleChapter(book: string, chapter: number) {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useStore();

  const fetchChapter = async () => {
    try {
      // Check if we have the chapters for this book in local storage
      const localChapter = await getLocalChapter(book, chapter);
      if (localChapter) {
        setData(localChapter);
        return;
      }

      // If not, fetch from Firebase
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
      setIsLoading(false);

      // Store all chapters for the book in local storage
      await AsyncStorage.setItem(
        `${book}-chapters`,
        JSON.stringify({ data: chapters, added: new Date() })
      );

      // Clear the oldest book from local storage if we've exceeded our threshold
      await clearOldestLocalBook();
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
