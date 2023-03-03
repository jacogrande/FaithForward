import {
  PlayableAudioObject,
  TSermon,
  TTradDevo,
  TPersonalDevo,
} from "@src/types";
import { Audio } from "expo-av";
import { create } from "zustand";

type Store = {
  input: string;
  promptStart: string | null;
  setInput: (input: string) => void;
  setPromptStart: (promptStart: string | null) => void;
  devotional: string;
  setDevotional: (devotional: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  pushToken: string | null;
  setPushToken: (pushToken: string | null) => void;
};

const useStore = create<Store>((set) => ({
  input: "",
  promptStart: null,
  setPromptStart: (promptStart: string | null) =>
    set((state) => ({ ...state, promptStart })),
  setInput: (input: string) => set((state) => ({ ...state, input })),
  devotional: "",
  setDevotional: (devotional: string) =>
    set((state) => ({ ...state, devotional })),
  error: null,
  setError: (error: string | null) => set((state) => ({ ...state, error })),
  pushToken: null,
  setPushToken: (pushToken: string | null) =>
    set((state) => ({ ...state, pushToken })),
}));

export default useStore;

type AudioStore = {
  sound: Audio.Sound | null;
  setSound: (sound: Audio.Sound | null) => void;
  playingAudioObject: PlayableAudioObject | null;
  setPlayingAudioObject: (
    playingAudioObject: PlayableAudioObject | null
  ) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
};

export const useAudioStore = create<AudioStore>((set) => ({
  sound: null,
  setSound: (sound: Audio.Sound | null) =>
    set((state) => ({ ...state, sound })),
  playingAudioObject: null,
  setPlayingAudioObject: (playingAudioObject: PlayableAudioObject | null) =>
    set((state) => ({ ...state, playingAudioObject })),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) =>
    set((state) => ({ ...state, isPlaying })),
}));

type ContentStore = {
  sermons: TSermon[];
  setSermons: (sermons: TSermon[]) => void;
  tradDevos: TTradDevo[];
  setTradDevos: (tradDevos: TTradDevo[]) => void;
  pastDevos: TPersonalDevo[];
  setPastDevos: (pastDevos: TPersonalDevo[]) => void;
  favorites: any[];
  setFavorites: (favorites: any[]) => void;
  pastExegeses: any[];
  setPastExegeses: (pastExegeses: any[]) => void;
};

export const useContentStore = create<ContentStore>((set) => ({
  sermons: [],
  setSermons: (sermons: TSermon[]) => set((state) => ({ ...state, sermons })),
  tradDevos: [],
  setTradDevos: (tradDevos: TTradDevo[]) =>
    set((state) => ({ ...state, tradDevos })),
  pastDevos: [],
  setPastDevos: (pastDevos: TPersonalDevo[]) =>
    set((state) => ({ ...state, pastDevos })),
  favorites: [],
  setFavorites: (favorites: any[]) => set((state) => ({ ...state, favorites })),
  pastExegeses: [],
  setPastExegeses: (pastExegeses: any[]) =>
    set((state) => ({ ...state, pastExegeses })),
}));

type BibleStore = {
  book: string | null;
  setBook: (book: string | null) => void;
  chapter: number | null;
  setChapter: (chapter: number | null) => void;
  verseNumber: number | null;
  setVerseNumber: (verseNumber: number | null) => void;
  verse: string | null;
  setVerse: (verse: string | null) => void;
  exegesis: string | null;
  setExegesis: (exegesis: string | null) => void;
};

export const useBibleStore = create<BibleStore>((set) => ({
  book: null,
  setBook: (book: string | null) => set((state) => ({ ...state, book })),
  chapter: null,
  setChapter: (chapter: number | null) =>
    set((state) => ({ ...state, chapter })),
  verseNumber: null,
  setVerseNumber: (verseNumber: number | null) =>
    set((state) => ({ ...state, verseNumber })),
  verse: null,
  setVerse: (verse: string | null) => set((state) => ({ ...state, verse })),
  exegesis: null,
  setExegesis: (exegesis: string | null) =>
    set((state) => ({ ...state, exegesis })),
}));
