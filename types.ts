import { Timestamp } from "@firebase/firestore";

export type TSermon = {
  id: string;
  filename: string;
  title: string;
  description: string;
  createdAt: Date | Timestamp;
  speaker: string;
  duration: number;
};

