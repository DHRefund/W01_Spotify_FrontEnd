"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

import SongCard from "@/components/song-card";
import PlaylistCard from "@/components/playlist-card";
import ArtistCard from "@/components/artist-card";

export default function Home() {
  const { data: session } = useSession();
  const [recentSongs, setRecentSongs] = useState([]);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch recent songs
        const songsResponse = await api.get("/songs/recent");
        setRecentSongs(songsResponse.data);

        // Fetch recommended playlists
        const playlistsResponse = await api.get("/playlists/recommended");
        setRecommendedPlaylists(playlistsResponse.data);

        // Fetch top artists
        const artistsResponse = await api.get("/artists/top");
        setTopArtists(artistsResponse.data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Placeholder data for development
  const placeholderSongs = [
    { id: "1", title: "Song 1", artist: { name: "Artist 1" }, imageUrl: "/images/music-placeholder.png" },
    { id: "2", title: "Song 2", artist: { name: "Artist 2" }, imageUrl: "/images/music-placeholder.png" },
    { id: "3", title: "Song 3", artist: { name: "Artist 3" }, imageUrl: "/images/music-placeholder.png" },
    { id: "4", title: "Song 4", artist: { name: "Artist 4" }, imageUrl: "/images/music-placeholder.png" },
  ];

  const placeholderPlaylists = [
    { id: "1", title: "Playlist 1", imageUrl: "/images/playlist-placeholder.png" },
    { id: "2", title: "Playlist 2", imageUrl: "/images/playlist-placeholder.png" },
    { id: "3", title: "Playlist 3", imageUrl: "/images/playlist-placeholder.png" },
  ];

  const placeholderArtists = [
    { id: "1", name: "Artist 1", imageUrl: "/images/artist-placeholder.png" },
    { id: "2", name: "Artist 2", imageUrl: "/images/artist-placeholder.png" },
    { id: "3", name: "Artist 3", imageUrl: "/images/artist-placeholder.png" },
  ];

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">Chào buổi tối</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          {(recentSongs.length > 0 ? recentSongs : placeholderSongs).map((song) => (
            <SongCard key={song.id} data={song} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <h2 className="text-white text-2xl font-semibold">Playlist dành cho bạn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {(recommendedPlaylists.length > 0 ? recommendedPlaylists : placeholderPlaylists).map((playlist) => (
            <PlaylistCard key={playlist.id} data={playlist} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <h2 className="text-white text-2xl font-semibold">Nghệ sĩ nổi bật</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
          {(topArtists.length > 0 ? topArtists : placeholderArtists).map((artist) => (
            <ArtistCard key={artist.id} data={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}
