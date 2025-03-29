import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setIsPlaying: (state: boolean) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  setId: (id: string) => {
    console.log("Setting active ID:", id);
    set({ activeId: id });
  },
  setIds: (ids: string[]) => {
    console.log("Setting IDs:", ids);
    set({ ids });
  },
  setIsPlaying: (state: boolean) => {
    set({ isPlaying: state });
  },
  reset: () => set({ ids: [], activeId: undefined, isPlaying: false }),
}));

export default usePlayer;
