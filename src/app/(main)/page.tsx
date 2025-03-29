"use client";

import { useSession } from "next-auth/react";
import SongCard from "@/components/song-card";
import PlaylistCard from "@/components/playlist-card";
import ArtistCard from "@/components/artist-card";
import { useRecentSongs, useRecommendedPlaylists, useTopArtists } from "@/hooks/useApi";

export default function Home() {
  const { data: session } = useSession();

  // Sử dụng React Query hooks
  const { data: recentSongs, isLoading: loadingRecentSongs } = useRecentSongs();
  const { data: recommendedPlaylists, isLoading: loadingPlaylists } = useRecommendedPlaylists();
  const { data: topArtists, isLoading: loadingArtists } = useTopArtists();

  // Placeholder data cho development
  const placeholderSongs = [
    { id: "1", title: "Song 1", artist: { name: "Artist 1" }, imageUrl: "/images/music-placeholder.png" },
    { id: "2", title: "Song 2", artist: { name: "Artist 2" }, imageUrl: "/images/music-placeholder.png" },
    { id: "3", title: "Song 3", artist: { name: "Artist 3" }, imageUrl: "/images/music-placeholder.png" },
    { id: "4", title: "Song 4", artist: { name: "Artist 4" }, imageUrl: "/images/music-placeholder.png" },
  ];

  // const placeholderPlaylists = [
  //   { id: "1", title: "Playlist 1", imageUrl: "/images/playlist-placeholder.png" },
  //   { id: "2", title: "Playlist 2", imageUrl: "/images/playlist-placeholder.png" },
  //   { id: "3", title: "Playlist 3", imageUrl: "/images/playlist-placeholder.png" },
  // ];

  const placeholderArtists = [
    { id: "1", name: "Artist 1", imageUrl: "/images/artist-placeholder.png" },
    { id: "2", name: "Artist 2", imageUrl: "/images/artist-placeholder.png" },
    { id: "3", name: "Artist 3", imageUrl: "/images/artist-placeholder.png" },
  ];

  // const isLoading = loadingRecentSongs || loadingPlaylists || loadingArtists;

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto mb-10">
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">Chào buổi tối</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          {loadingRecentSongs
            ? placeholderSongs.map((song, index) => (
                <div key={index} className="bg-neutral-800 p-3 rounded-md animate-pulse h-20" />
              ))
            : (recentSongs?.length > 0 ? recentSongs : placeholderSongs).map((song) => (
                <SongCard key={song.id} data={song} />
              ))}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <h2 className="text-white text-2xl font-semibold">Playlist dành cho bạn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {loadingPlaylists ? (
            Array(6)
              .fill(0)
              .map((_, index) => <div key={index} className="bg-neutral-800 aspect-square rounded-md animate-pulse" />)
          ) : recommendedPlaylists?.length > 0 ? (
            recommendedPlaylists.map((playlist) => <PlaylistCard key={playlist.id} data={playlist} />)
          ) : (
            <div className="text-neutral-400">Hãy tạo playlist cho riêng bạn</div>
          )}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <h2 className="text-white text-2xl font-semibold">Nghệ sĩ nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {loadingArtists
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-neutral-800 aspect-square rounded-full animate-pulse" />
                ))
            : (topArtists?.length > 0 ? topArtists : placeholderArtists).map((artist) => (
                <ArtistCard key={artist.id} data={artist} />
              ))}
        </div>
      </div>
    </div>
  );
}
