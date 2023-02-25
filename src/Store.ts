import { PlayableAudioObject } from "@root/types";
import { Audio } from "expo-av";
import { create } from "zustand";

type Store = {
  input: string;
  promptStart: string | null;
  selectedVerse: string | null;
  setInput: (input: string) => void;
  setPromptStart: (promptStart: string | null) => void;
  setSelectedVerse: (selectedVerse: string | null) => void;
  devotional: string;
  setDevotional: (devotional: string) => void;
  promptId: string;
  setPromptId: (promptId: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  pushToken: string | null;
  setPushToken: (pushToken: string | null) => void;
};

const useStore = create<Store>((set) => ({
  input: "",
  promptStart: null,
  selectedVerse: null,
  setPromptStart: (promptStart: string | null) =>
    set((state) => ({ ...state, promptStart })),
  setInput: (input: string) => set((state) => ({ ...state, input })),
  setSelectedVerse: (selectedVerse: string | null) =>
    set((state) => ({ ...state, selectedVerse })),
  devotional: "",
  setDevotional: (devotional: string) =>
    set((state) => ({ ...state, devotional })),
  promptId: "",
  setPromptId: (promptId: string) => set((state) => ({ ...state, promptId })),
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
