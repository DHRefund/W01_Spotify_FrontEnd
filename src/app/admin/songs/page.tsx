"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
}

interface Song {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  duration: number;
  createdAt: string;
}

export default function AdminSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    artistId: "",
    lyrics: "",
    song: null as File | null,
    image: null as File | null,
  });

  const fetchArtists = async () => {
    try {
      const response = await api.get("/admin/artists");
      setArtists(response.data.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nghệ sĩ");
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await api.get(`/admin/songs?page=${page}&limit=10`);
      setSongs(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách bài hát");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchSongs();
  }, [page]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.song) {
      toast.error("Vui lòng chọn file bài hát");
      return;
    }

    if (!uploadData.artistId) {
      toast.error("Vui lòng chọn nghệ sĩ");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("artistId", uploadData.artistId);
    formData.append("lyrics", uploadData.lyrics);
    formData.append("song", uploadData.song);
    if (uploadData.image) {
      formData.append("image", uploadData.image);
    }

    try {
      await api.post("/admin/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Tải lên bài hát thành công");
      fetchSongs();
      setUploadData({
        title: "",
        artistId: "",
        lyrics: "",
        song: null,
        image: null,
      });
    } catch (error) {
      toast.error("Lỗi khi tải lên bài hát");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài hát này?")) return;

    try {
      await api.delete(`/admin/songs/${songId}`);
      toast.success("Xóa bài hát thành công");
      fetchSongs();
    } catch (error) {
      toast.error("Lỗi khi xóa bài hát");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý bài hát</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tải lên bài hát</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên bài hát</label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nghệ sĩ</label>
              <select
                value={uploadData.artistId}
                onChange={(e) => setUploadData({ ...uploadData, artistId: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 rounded"
                required
              >
                <option value="">Chọn nghệ sĩ</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lời bài hát</label>
              <textarea
                value={uploadData.lyrics}
                onChange={(e) => setUploadData({ ...uploadData, lyrics: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">File bài hát</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    song: e.target.files?.[0] || null,
                  })
                }
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ảnh bìa</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-400 disabled:opacity-50"
            >
              {isUploading ? "Đang tải lên..." : "Tải lên"}
            </button>
          </form>
        </div>

        <div className="bg-neutral-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-800">
                <th className="px-6 py-3 text-left">Tên</th>
                <th className="px-6 py-3 text-left">Nghệ sĩ</th>
                <th className="px-6 py-3 text-left">Thời lượng</th>
                <th className="px-6 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id} className="border-t border-neutral-800">
                  <td className="px-6 py-4">{song.title}</td>
                  <td className="px-6 py-4">{song.artist.name}</td>
                  <td className="px-6 py-4">
                    {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteSong(song.id)} className="text-red-500 hover:text-red-400">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-green-500 text-white" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
