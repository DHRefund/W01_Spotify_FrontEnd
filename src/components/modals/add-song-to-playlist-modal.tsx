"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDebounce } from "use-debounce";
import { FaSearch, FaPlus } from "react-icons/fa";
import api from "@/lib/axios";
import axios from "axios";

import Modal from "./modal";
import Input from "../ui/input";
import Button from "../ui/button";
import MediaItem from "../media-item";
import useAddSongModal from "@/hooks/useAddSongToPlaylistModal";

const AddSongToPlaylistModal = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const addSongModal = useAddSongModal();

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Tự động focus vào ô tìm kiếm khi modal mở
  useEffect(() => {
    if (addSongModal.isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [addSongModal.isOpen]);

  // Lấy danh sách ID bài hát đã có trong playlist
  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      if (!addSongModal.playlistId) return;

      try {
        const { data } = await api.get(`/playlists/${addSongModal.playlistId}`);
        setPlaylistSongs(data.songs.map((song) => song.id));
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    };

    if (addSongModal.isOpen && addSongModal.playlistId) {
      fetchPlaylistSongs();
    }
  }, [addSongModal.isOpen, addSongModal.playlistId]);

  // Tìm kiếm bài hát khi từ khóa thay đổi
  useEffect(() => {
    const searchSongs = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        console.log(`Tìm kiếm với từ khóa: ${debouncedSearchTerm}`);
        const { data } = await api.get(`/songs/search?query=${encodeURIComponent(debouncedSearchTerm)}`);
        console.log("Kết quả tìm kiếm:", data);
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching songs:", error);
        if (axios.isAxiosError(error)) {
          console.error("Status:", error.response?.status);
          console.error("Data:", error.response?.data);
        }
        toast.error("Không thể tìm kiếm bài hát");
      } finally {
        setIsLoading(false);
      }
    };

    searchSongs();
  }, [debouncedSearchTerm]);

  // Thêm bài hát vào playlist
  const handleAddSong = async (songId: string) => {
    if (!addSongModal.playlistId || !session?.user) return;

    try {
      setIsAdding((prev) => ({ ...prev, [songId]: true }));

      await api.post(`/playlists/${addSongModal.playlistId}/songs`, { songId });

      // Thêm ID bài hát vào danh sách để ẩn nút thêm
      setPlaylistSongs((prev) => [...prev, songId]);

      toast.success("Đã thêm bài hát vào playlist");

      // Refresh trang playlist để cập nhật UI
      router.refresh();
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      toast.error("Không thể thêm bài hát vào playlist");
    } finally {
      setIsAdding((prev) => ({ ...prev, [songId]: false }));
    }
  };

  // Đóng modal và reset state
  const handleClose = () => {
    setSearchTerm("");
    setSearchResults([]);
    setPlaylistSongs([]);
    addSongModal.onClose();
  };

  return (
    <Modal
      title="Thêm bài hát vào playlist"
      description="Tìm kiếm và thêm bài hát vào playlist của bạn"
      isOpen={addSongModal.isOpen}
      onChange={(open) => !open && handleClose()}
    >
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-neutral-400" />
        <Input
          ref={searchInputRef}
          placeholder="Tìm kiếm bài hát hoặc nghệ sĩ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
          className="pl-10"
        />
      </div>

      <div className="mt-4 max-h-[400px] overflow-y-auto">
        {/* Trạng thái đang tìm kiếm */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-t-2 border-green-500 mb-2"></div>
            <p className="text-neutral-400">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Hiển thị khi không có kết quả tìm kiếm */}
        {!isLoading && debouncedSearchTerm && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-neutral-400">Không tìm thấy bài hát phù hợp</p>
          </div>
        )}

        {/* Gợi ý khi chưa nhập từ khóa */}
        {!isLoading && !debouncedSearchTerm && (
          <div className="flex flex-col items-center justify-center py-10">
            <FaSearch size={30} className="text-neutral-500 mb-2" />
            <p className="text-neutral-400">Nhập từ khóa để tìm kiếm bài hát</p>
          </div>
        )}

        {/* Danh sách kết quả tìm kiếm */}
        {!isLoading && searchResults.length > 0 && (
          <div className="flex flex-col gap-y-2">
            {searchResults.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 hover:bg-neutral-800/50 rounded-md transition"
              >
                <MediaItem data={song} onClick={() => {}} />

                {/* Hiển thị nút thêm hoặc thông báo đã thêm */}
                {playlistSongs.includes(song.id) ? (
                  <div className="text-sm text-neutral-400 px-4">Đã có trong playlist</div>
                ) : (
                  <Button
                    onClick={() => handleAddSong(song.id)}
                    disabled={isAdding[song.id]}
                    className="flex items-center gap-x-1 h-8 px-3"
                  >
                    {isAdding[song.id] ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                    ) : (
                      <>
                        <FaPlus size={12} />
                        <span>Thêm vào playlist</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddSongToPlaylistModal;
