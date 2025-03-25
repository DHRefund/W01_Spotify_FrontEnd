import { create } from "zustand";

interface PlaylistData {
  id: string;
  title: string;
  description: string;
}

interface EditPlaylistModalStore {
  isOpen: boolean;
  playlistData: PlaylistData;
  onOpen: () => void;
  onClose: () => void;
  setPlaylistData: (data: PlaylistData) => void;
}

const useEditPlaylistModal = create<EditPlaylistModalStore>((set) => ({
  isOpen: false,
  playlistData: {
    id: "",
    title: "",
    description: "",
  },
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setPlaylistData: (data) => set({ playlistData: data }),
}));

export default useEditPlaylistModal;
