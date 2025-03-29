"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LikeButton from "@/components/like-button";
import ShareButton from "@/components/share-button";
import usePlayer from "@/hooks/usePlayer";
import { FaPlay, FaPause } from "react-icons/fa";
import Lyrics from "@/components/lyrics";
import { useSong } from "@/hooks/useApi";

export default function SongPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Sử dụng React Query
  const { data: song, isLoading, error } = useSong(params.id);

  useEffect(() => {
    if (song && session?.user?.id === song.userId) {
      setIsOwner(true);
    }
  }, [song, session?.user?.id]);

  useEffect(() => {
    setIsPlaying(player.activeId === params.id && player.isPlaying);
  }, [player.activeId, player.isPlaying, params.id]);

  const handlePlay = () => {
    if (isPlaying) {
      player.setIsPlaying(false);
    } else {
      player.setId(params.id);
      player.setIds([params.id]);
      player.setIsPlaying(true);
    }
  };

  // Placeholder data for development
  const placeholderSong = {
    id: params.id,
    title: "Song Title",
    artist: { id: "1", name: "Artist Name" },
    imageUrl: "/images/music-placeholder.png",
    url: "",
    lyrics: "",
  };

  const songData = song || placeholderSong;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Có lỗi xảy ra khi tải bài hát</div>;
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-center gap-x-5 mt-20">
          <div className="relative h-32 w-32 lg:h-44 lg:w-44">
            <Image fill src={songData.imageUrl} alt="Song" className="object-cover" />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">Bài hát</p>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">{songData.title}</h1>
            <p className="text-neutral-400 text-sm">Nghệ sĩ: {songData.artist.name}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center gap-x-5 gap-y-4">
          <button
            onClick={handlePlay}
            className="rounded-full bg-green-500 p-4 flex items-center justify-center hover:bg-green-600 transition"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <LikeButton songId={songData.id} />
          <ShareButton type="song" id={songData.id} title={songData.title} />
        </div>
      </div>

      <div className="px-6 pb-20">
        <Lyrics songId={songData.id} initialLyrics={songData.lyrics} isOwner={isOwner} />
      </div>
    </div>
  );
}
