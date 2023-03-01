import { Timestamp } from "@firebase/firestore";
import { LOADING_MESSAGES } from "@src/constants";

export const ensureDate = (date: Date | Timestamp): Date => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string") {
    return new Date(date);
  }

  if (date instanceof Timestamp) {
    return date.toDate();
  }

  return new Date();
};

export const formatDate = (date: Date | Timestamp): string => {
  const d = ensureDate(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time
export const formatTime = (date: Date | Timestamp): string => {
  const d = ensureDate(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Given a verse string, return the book, chapter number, and verse number
// Assumes the verse contains refs in the format: (book chapterNum:verseNum)
// TODO: Improve validation
export function getVerseRefs(verse: string): {
  book: string;
  chapter: number;
  verseNum: number;
} {
  if (!verse.includes("(") || !verse.includes(")")) {
    return { book: "", chapter: 0, verseNum: 0 };
  }

  // Strip the parens
  const verseRef = verse.substring(verse.indexOf("(") + 1, verse.indexOf(")"));

  // Split the string into book, chapter, and verse
  // Note: the book is sometimes two words, so split on colon first for chapter and verse
  // The last element of the array is the verse number, and the one before that is the chapter
  const verseRefArray = verseRef.split(":");
  const verseNum = parseInt(verseRefArray[verseRefArray.length - 1]);
  // Then split the first element on spaces, and the last element is the chapter
  const chapter = parseInt(
    verseRefArray[0].split(" ")[verseRefArray[0].split(" ").length - 1]
  );
  // The rest of the elements are the book
  let book = verseRefArray[0].substring(
    0,
    verseRefArray[0].indexOf(chapter.toString())
  ).trim();

  // Convert 1s, 2s, and 3s to roman numerals
  if (book.includes("1")) {
    book = book.replace("1", "I");
  }
  if (book.includes("2")) {
    book = book.replace("2", "II");
  }
  if (book.includes("3")) {
    book = book.replace("3", "III");
  }

  if (book.trim() === "Psalm") {
    book = "Psalms"
  }

  return { book, chapter, verseNum };
}

export const getVerseRef = (verse: string, fullResponse: string) => {
  // insert spaces after each opening parenthesis and before each closing parenthesis
  const match = new RegExp(
    /(?:\b\d+ )?[a-z]+ ?\d+(?:(?::\d+)?(?: ?- ?(?:\d+ [a-z]+ )?\d+(?::\d+)?)?)?(?=\b)/i
  );
  // check the characters around the pressed verse to try and find the verse reference
  const verseIndex = fullResponse.indexOf(verse);
  const startIndex = verseIndex - 100;
  const surroundingText = fullResponse.slice(
    startIndex > 0 ? startIndex : 0,
    verseIndex + verse.length + 50
  );
  const reference = surroundingText.match(match);
  if (reference?.toString().toLowerCase().substring(0, 2) === "in") {
    // cut the full response from the "in" to the end
    const newResponse = fullResponse.slice(
      fullResponse.indexOf(reference?.toString()) + 2,
      fullResponse.length
    );
    // find the next verse reference
    const newReference = newResponse.match(match);
    return newReference?.toString();
  }
  return reference?.toString();
};

export const getRandomLoadingMessage = () => {
  const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.PILE.length);
  return LOADING_MESSAGES.PILE[randomIndex];
};
