"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlay, FaPlus } from "react-icons/fa";

import MediaItem from "@/components/media-item";
import LikeButton from "@/components/like-button";
import usePlayer from "@/hooks/usePlayer";
import Button from "@/components/ui/button";
import useEditPlaylistModal from "@/hooks/useEditPlaylistModal";
import ShareButton from "@/components/share-button";
import useAddSongModal from "@/hooks/useAddSongToPlaylistModal";
import LoadingSpinner from "@/components/loading-spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();
  const editPlaylistModal = useEditPlaylistModal();
  const addSongModal = useAddSongModal();
  const queryClient = useQueryClient();

  // Sử dụng React Query để fetch playlist
  const {
    data: playlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["playlists", params.id],
    queryFn: () => api.get(`/playlists/${params.id}`).then((res) => res.data),
    enabled: !!params.id,
  });

  // Xác định nếu người dùng hiện tại là chủ sở hữu
  const isOwner = playlist && session?.user?.id === playlist.user.id;

  // Mutation để xóa playlist
  const deletePlaylistMutation = useMutation({
    mutationFn: () => api.delete(`/playlists/${params.id}`),
    onSuccess: () => {
      toast.success("Đã xóa playlist");
      router.push("/");
    },
    onError: () => {
      toast.error("Không thể xóa playlist");
    },
  });

  // Mutation để xóa bài hát khỏi playlist
  const removeSongMutation = useMutation({
    mutationFn: (songId: string) => api.delete(`/playlists/${params.id}/songs/${songId}`),
    onSuccess: () => {
      toast.success("Đã xóa bài hát khỏi playlist");
      // Cập nhật lại dữ liệu playlist
      queryClient.invalidateQueries({ queryKey: ["playlists", params.id] });
    },
    onError: () => {
      toast.error("Không thể xóa bài hát");
    },
  });

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(playlist?.songs?.map((song) => song.id) || []);
    player.setIsPlaying(true);
  };

  const handleEdit = () => {
    if (playlist) {
      editPlaylistModal.setPlaylistData({
        id: playlist.id,
        title: playlist.title,
        description: playlist.description || "",
      });
      editPlaylistModal.onOpen();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa playlist này?")) {
      return;
    }
    deletePlaylistMutation.mutate();
  };

  const handleRemoveSong = async (songId: string) => {
    removeSongMutation.mutate(songId);
  };

  const handleAddSong = () => {
    addSongModal.onOpen(params.id);
  };

  // Placeholder data for development
  const placeholderPlaylist = {
    id: params.id,
    title: "Playlist Name",
    description: "Playlist description",
    imageUrl: "/images/playlist-placeholder.png",
    user: { id: "", name: "User" },
    songs: [
      { id: "1", title: "Song 1", artist: { name: "Artist 1" }, imageUrl: "/images/music-placeholder.png" },
      { id: "2", title: "Song 2", artist: { name: "Artist 2" }, imageUrl: "/images/music-placeholder.png" },
      { id: "3", title: "Song 3", artist: { name: "Artist 3" }, imageUrl: "/images/music-placeholder.png" },
    ],
  };

  const playlistData = playlist || placeholderPlaylist;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Không thể tải thông tin playlist</div>;
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-center gap-x-5 mt-20">
          <div className="relative h-32 w-32 lg:h-44 lg:w-44">
            <Image fill src={playlistData.imageUrl} alt="Playlist" className="object-cover" />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <div className="flex items-center gap-x-2">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              {isOwner && (
                <div className="flex gap-x-2">
                  <button onClick={handleEdit} className="text-white hover:text-green-500 transition">
                    <FaEdit size={16} />
                  </button>
                  <button onClick={handleDelete} className="text-white hover:text-red-500 transition">
                    <FaTrash size={16} />
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">{playlistData.title}</h1>
            {playlistData.description && <p className="text-neutral-400 text-sm">{playlistData.description}</p>}
            <p className="text-neutral-400 text-sm">Tạo bởi: {playlistData.user.name}</p>
          </div>
        </div>

        <div className="mt-10">
          {playlistData.songs.length === 0 ? (
            <div className="text-neutral-400 text-center py-10">Playlist này chưa có bài hát nào</div>
          ) : (
            <div className="flex flex-col gap-y-2">
              {playlistData.songs.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full">
                  <div className="flex-1">
                    <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
                  </div>
                  <LikeButton songId={song.id} />
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveSong(song.id)}
                      className="text-neutral-400 hover:text-white transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-x-5 gap-y-4">
          <button
            onClick={() => onPlay(playlistData.songs[0]?.id)}
            className="rounded-full bg-green-500 p-4 flex items-center justify-center hover:bg-green-600 transition"
            disabled={playlistData.songs.length === 0}
          >
            <FaPlay size={24} />
          </button>
          <ShareButton type="playlist" id={playlistData.id} title={playlistData.title} />
          {isOwner && (
            <Button onClick={handleAddSong} className="bg-green-500 text-black flex items-center gap-x-2">
              <FaPlus />
              Thêm bài hát
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
