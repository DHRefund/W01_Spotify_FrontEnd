"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  songCount: number;
  createdAt: string;
}

export default function AdminArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    image: null as File | null,
  });

  const fetchArtists = async () => {
    try {
      const response = await api.get(`/admin/artists?page=${page}&limit=10`);
      console.log(response.data);
      setArtists(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nghệ sĩ ahihi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [page]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name.trim()) {
      toast.error("Vui lòng nhập tên nghệ sĩ");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", uploadData.name);
    if (uploadData.image) {
      formData.append("image", uploadData.image);
    }

    try {
      await api.post("/admin/artists", formData);
      toast.success("Thêm nghệ sĩ thành công");
      fetchArtists();
      setUploadData({
        name: "",
        image: null,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Lỗi khi thêm nghệ sĩ");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (!confirm("Bạn có chắc muốn xóa nghệ sĩ này?")) return;

    try {
      await api.delete(`/admin/artists/${artistId}`);
      toast.success("Xóa nghệ sĩ thành công");
      fetchArtists();
    } catch (error) {
      toast.error("Lỗi khi xóa nghệ sĩ");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý nghệ sĩ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Thêm nghệ sĩ mới</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên nghệ sĩ</label>
              <input
                type="text"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-800 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ảnh đại diện</label>
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
              {isUploading ? "Đang tải lên..." : "Thêm nghệ sĩ"}
            </button>
          </form>
        </div>

        <div className="bg-neutral-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-800">
                <th className="px-6 py-3 text-left">Ảnh</th>
                <th className="px-6 py-3 text-left">Tên</th>
                <th className="px-6 py-3 text-left">Số bài hát</th>
                <th className="px-6 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id} className="border-t border-neutral-800">
                  <td className="px-6 py-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={artist.imageUrl || "/images/artist-placeholder.png"}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">{artist.name}</td>
                  <td className="px-6 py-4">{artist.songCount} bài hát</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteArtist(artist.id)} className="text-red-500 hover:text-red-400">
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
