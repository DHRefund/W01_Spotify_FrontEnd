"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Input from "@/components/ui/input";
import MediaItem from "@/components/media-item";
import PlaylistCard from "@/components/playlist-card";
import ArtistCard from "@/components/artist-card";
import { useSearch } from "@/hooks/useApi";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const { data: searchResults, isLoading } = useSearch(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  // Placeholder data for development
  const placeholderSongs = [
    { id: "1", title: "Song 1", artist: { name: "Artist 1" }, imageUrl: "/images/music-placeholder.png" },
    { id: "2", title: "Song 2", artist: { name: "Artist 2" }, imageUrl: "/images/music-placeholder.png" },
  ];

  const placeholderPlaylists = [
    { id: "1", title: "Playlist 1", imageUrl: "/images/playlist-placeholder.png" },
    { id: "2", title: "Playlist 2", imageUrl: "/images/playlist-placeholder.png" },
  ];

  const placeholderArtists = [
    { id: "1", name: "Artist 1", imageUrl: "/images/artist-placeholder.png" },
    { id: "2", name: "Artist 2", imageUrl: "/images/artist-placeholder.png" },
  ];

  const songs = searchResults?.songs || (searchQuery ? [] : placeholderSongs);
  const playlists = searchResults?.playlists || (searchQuery ? [] : placeholderPlaylists);
  const artists = searchResults?.artists || (searchQuery ? [] : placeholderArtists);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="p-6">
        <h1 className="text-white text-3xl font-semibold mb-4">Tìm kiếm</h1>
        <Input placeholder="Bạn muốn nghe gì?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

        {isLoading && (
          <div className="flex justify-center items-center h-24">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
          </div>
        )}

        {!isLoading && searchQuery && songs.length === 0 && playlists.length === 0 && artists.length === 0 && (
          <div className="text-neutral-400 text-center py-10">Không tìm thấy kết quả nào cho "{searchQuery}"</div>
        )}

        {songs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-white text-2xl font-semibold mb-4">Bài hát</h2>
            <div className="flex flex-col gap-y-2">
              {songs.map((song) => (
                <MediaItem key={song.id} data={song} />
              ))}
            </div>
          </div>
        )}

        {playlists.length > 0 && (
          <div className="mt-6">
            <h2 className="text-white text-2xl font-semibold mb-4">Playlist</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} data={playlist} />
              ))}
            </div>
          </div>
        )}

        {artists.length > 0 && (
          <div className="mt-6">
            <h2 className="text-white text-2xl font-semibold mb-4">Nghệ sĩ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} data={artist} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
