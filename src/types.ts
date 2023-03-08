import { Timestamp } from "@firebase/firestore";

export type TSermon = {
  id: string;
  filename: string;
  title: string;
  description: string;
  createdAt: Date | Timestamp;
  speaker: string;
  duration: number;
  favoritedBy: string[];
};

export type TTradDevo = {
  id: string;
  title: string;
  input: string;
  response: string;
  favoritedBy: string[];
  createdAt: Date | Timestamp;
};

export type TPersonalDevo = {
  id: string;
  input: string;
  response: string;
  favorited: boolean;
  createdAt: Date | Timestamp;
};

export type TDevo = TTradDevo | TPersonalDevo;

export interface PlayableAudioObject {
  id: string;
  filename: string;
  title: string;
}

export type TBook = {
  chapters: number;
  nextBook: string | null;
  prevBook: string | null;
};

export type TVerseRef = {
  bible: string;
  book: string;
  chapter: number;
  verseNumber: number;
};

export type TExegesis = {
  id: string;
  book?: string;
  chapter?: number;
  verseNumber?: number;
  verse?: string;
  response: string;
  createdAt: Date | Timestamp;
  type?: string;
  input?: string;
};

export type FaveViewType = "devos" | "verses" | "sermons" | "exegeses";
