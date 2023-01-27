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
}));

export default useStore;
