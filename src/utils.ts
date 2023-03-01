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

  const splits = verse.split("(");
  const reference = splits[splits.length - 1].replace(")", "");
  const [book, chapterAndVerse] = reference.split(" ");
  const chapter = parseInt(chapterAndVerse.split(":")[0]);
  const verseNum = parseInt(chapterAndVerse.split(":")[1]);
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
