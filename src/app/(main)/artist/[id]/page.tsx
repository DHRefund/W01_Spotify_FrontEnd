"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import MediaItem from "@/components/media-item";
import usePlayer from "@/hooks/usePlayer";
import LoadingSpinner from "@/components/loading-spinner";

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const player = usePlayer();

  // Sử dụng React Query để fetch artist
  const {
    data: artist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["artists", params.id],
    queryFn: () => api.get(`/artists/${params.id}`).then((res) => res.data),
    enabled: !!params.id,
  });

  // Sử dụng React Query để fetch bài hát của artist
  const { data: artistSongs, isLoading: songsLoading } = useQuery({
    queryKey: ["artists", params.id, "songs"],
    queryFn: () => api.get(`/artists/${params.id}/songs`).then((res) => res.data),
    enabled: !!params.id,
  });

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(artistSongs?.map((song) => song.id) || []);
    player.setIsPlaying(true);
  };

  if (isLoading || songsLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Không thể tải thông tin nghệ sĩ</div>;
  }

  const artistData = artist || {
    id: params.id,
    name: "Artist Name",
    imageUrl: "/images/artist-placeholder.png",
    bio: "Artist bio",
  };

  const songs = artistSongs || [];

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-center gap-x-5 mt-20">
          <div className="relative h-32 w-32 lg:h-44 lg:w-44">
            <Image fill src={artistData.imageUrl} alt="Artist" className="object-cover rounded-full" />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">Nghệ sĩ</p>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">{artistData.name}</h1>
            {artistData.bio && <p className="text-neutral-400 text-sm">{artistData.bio}</p>}
          </div>
        </div>

        {songs.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-white text-2xl font-semibold mb-4">Bài hát nổi bật</h2>
            <div className="flex flex-col gap-y-2">
              {songs.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full">
                  <div className="flex-1">
                    <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 text-neutral-400 text-center">Chưa có bài hát nào</div>
        )}

        <div className="mt-10 flex flex-col md:flex-row items-center gap-x-5 gap-y-4 mb-10">
          {songs.length > 0 && (
            <button
              onClick={() => onPlay(songs[0].id)}
              className="rounded-full bg-green-500 p-4 flex items-center justify-center hover:bg-green-600 transition"
            >
              <FaPlay size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
