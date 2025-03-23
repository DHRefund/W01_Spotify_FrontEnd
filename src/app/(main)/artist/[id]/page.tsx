"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import Image from "next/image";

import MediaItem from "@/components/media-item";
import LikeButton from "@/components/like-button";
import usePlayer from "@/hooks/usePlayer";
import PlaylistCard from "@/components/playlist-card";

export default function ArtistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();

  const [artist, setArtist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) {
      return;
    }

    const fetchArtist = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/artists/${params.id}`);
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [params.id]);

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(artist?.songs?.map((song) => song.id) || []);
  };

  // Placeholder data for development
  const placeholderArtist = {
    id: params.id,
    name: "Artist Name",
    imageUrl: "/images/artist-placeholder.png",
    songs: [
      { id: "1", title: "Song 1", artist: { name: "Artist Name" }, imageUrl: "/images/music-placeholder.png" },
      { id: "2", title: "Song 2", artist: { name: "Artist Name" }, imageUrl: "/images/music-placeholder.png" },
      { id: "3", title: "Song 3", artist: { name: "Artist Name" }, imageUrl: "/images/music-placeholder.png" },
    ],
    albums: [
      { id: "1", title: "Album 1", imageUrl: "/images/playlist-placeholder.png" },
      { id: "2", title: "Album 2", imageUrl: "/images/playlist-placeholder.png" },
    ],
  };

  const artistData = artist || placeholderArtist;

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
          <div className="relative h-32 w-32 lg:h-44 lg:w-44 rounded-full overflow-hidden">
            <Image fill src={artistData.imageUrl} alt="Artist" className="object-cover" />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="hidden md:block font-semibold text-sm">Nghệ sĩ</p>
            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">{artistData.name}</h1>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-white text-2xl font-semibold mb-4">Bài hát phổ biến</h2>
          {artistData.songs.length === 0 ? (
            <div className="text-neutral-400 text-center py-10">Nghệ sĩ này chưa có bài hát nào</div>
          ) : (
            <div className="flex flex-col gap-y-2">
              {artistData.songs.map((song) => (
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

        {artistData.albums && artistData.albums.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white text-2xl font-semibold mb-4">Album</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {artistData.albums.map((album) => (
                <PlaylistCard key={album.id} data={album} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
