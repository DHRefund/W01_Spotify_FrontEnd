"use client";

import { useState, useEffect } from "react";
import Modal from "./ui/modal";
import Input from "./ui/input";
import useAddSongModal from "@/hooks/useAddSongToPlaylistModal";
import { useSearchSongs, useAddSongToPlaylist } from "@/hooks/usePlaylistApi";
import MediaItem from "./media-item";
import Button from "./ui/button";

const AddSongToPlaylistModal = () => {
  const { isOpen, onClose, playlistId } = useAddSongModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSongId, setSelectedSongId] = useState("");

  // Sử dụng React Query để tìm kiếm bài hát
  const { data: searchResults, isLoading } = useSearchSongs(searchQuery);

  // Sử dụng React Query mutation để thêm bài hát vào playlist
  const { mutate: addSong, isLoading: isAdding } = useAddSongToPlaylist();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAdd = () => {
    if (!selectedSongId || !playlistId) return;

    addSong(
      { playlistId, songId: selectedSongId },
      {
        onSuccess: () => {
          setSelectedSongId("");
          setSearchQuery("");
          onClose();
        },
      }
    );
  };

  const songs = searchResults || [];

  return (
    <Modal
      title="Thêm bài hát vào playlist"
      description="Tìm kiếm và thêm bài hát vào playlist của bạn"
      isOpen={isOpen}
      onChange={onClose}
    >
      <Input placeholder="Tìm kiếm bài hát..." value={searchQuery} onChange={handleSearch} disabled={isAdding} />

      <div className="mt-4 max-h-60 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4">Đang tìm kiếm...</div>
        ) : songs.length === 0 ? (
          <div className="text-center py-4">Không tìm thấy bài hát nào</div>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              className={`
                flex items-center p-2 cursor-pointer rounded-md
                ${selectedSongId === song.id ? "bg-neutral-800" : "hover:bg-neutral-800"}
              `}
              onClick={() => setSelectedSongId(song.id)}
            >
              <MediaItem data={song} />
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-x-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={isAdding}>
          Hủy
        </Button>
        <Button onClick={handleAdd} disabled={!selectedSongId || isAdding}>
          Thêm
        </Button>
      </div>
    </Modal>
  );
};

export default AddSongToPlaylistModal;
