"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

import MediaItem from "@/components/media-item";
import LikeButton from "@/components/like-button";
import usePlayer from "@/hooks/usePlayer";

export default function Liked() {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();

  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const fetchLikedSongs = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/liked");
        setLikedSongs(data);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [session?.user]);

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(likedSongs.map((song) => song.id));
  };

  // Placeholder data for development
  const placeholderSongs = [
    { id: "1", title: "Liked Song 1", artist: { name: "Artist 1" }, imageUrl: "/images/music-placeholder.png" },
    { id: "2", title: "Liked Song 2", artist: { name: "Artist 2" }, imageUrl: "/images/music-placeholder.png" },
    { id: "3", title: "Liked Song 3", artist: { name: "Artist 3" }, imageUrl: "/images/music-placeholder.png" },
  ];

  const songs = likedSongs.length > 0 ? likedSongs : placeholderSongs;

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
            <img src="/images/liked.png" alt="Playlist" className="object-cover" />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">Playlist</p>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">Bài hát đã thích</h1>
          </div>
        </div>

        <div className="mt-10">
          {songs.length === 0 ? (
            <div className="text-neutral-400 text-center py-10">Bạn chưa thích bài hát nào</div>
          ) : (
            <div className="flex flex-col gap-y-2">
              {songs.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full">
                  <div className="flex-1">
                    <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
                  </div>
                  <LikeButton songId={song.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
