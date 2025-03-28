import { create } from "zustand";

interface AddSongModalStore {
  isOpen: boolean;
  playlistId: string | null;
  onOpen: (playlistId: string) => void;
  onClose: () => void;
}

const useAddSongToPlaylistModal = create<AddSongModalStore>((set) => ({
  isOpen: false,
  playlistId: null,
  onOpen: (playlistId: string) => set({ isOpen: true, playlistId }),
  onClose: () => set({ isOpen: false, playlistId: null }),
}));

export default useAddSongToPlaylistModal;
