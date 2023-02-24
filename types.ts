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
}

export interface PlayableAudioObject {
  id: string;
  filename: string;
  title: string;
}
