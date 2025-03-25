"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlay } from "react-icons/fa";

import MediaItem from "@/components/media-item";
import LikeButton from "@/components/like-button";
import usePlayer from "@/hooks/usePlayer";
import Button from "@/components/ui/button";
import useEditPlaylistModal from "@/hooks/useEditPlaylistModal";
import ShareButton from "@/components/share-button";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();
  const editPlaylistModal = useEditPlaylistModal();

  const [playlist, setPlaylist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const fetchPlaylist = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/playlists/${params.id}`);
        setPlaylist(data);

        // Check if current user is the owner
        if (session?.user?.id === data.user.id) {
          setIsOwner(true);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [params.id, session?.user?.id]);

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(playlist?.songs?.map((song) => song.id) || []);
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

    try {
      await api.delete(`/playlists/${params.id}`);
      toast.success("Đã xóa playlist");
      router.push("/");
    } catch (error) {
      toast.error("Không thể xóa playlist");
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      await api.delete(`/playlists/${params.id}/songs/${songId}`);

      // Update the playlist in state
      setPlaylist({
        ...playlist,
        songs: playlist.songs.filter((song) => song.id !== songId),
      });

      toast.success("Đã xóa bài hát khỏi playlist");
    } catch (error) {
      toast.error("Không thể xóa bài hát");
    }
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
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
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
        </div>
      </div>
    </div>
  );
}
