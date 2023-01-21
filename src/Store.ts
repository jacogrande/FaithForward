import create from "zustand";

type Store = {
  input: string;
  promptStart: string | null;
  setInput: (input: string) => void;
  setPromptStart: (promptStart: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const useStore = create<Store>((set) => ({
  input: "",
  promptStart: null,
  setPromptStart: (promptStart: string | null) =>
    set((state) => ({ ...state, promptStart })),
  setInput: (input: string) => set((state) => ({ ...state, input })),
  error: null,
  setError: (error: string | null) => set((state) => ({ ...state, error })),
}));

export default useStore;
