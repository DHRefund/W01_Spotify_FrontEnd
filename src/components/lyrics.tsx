"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { FaEdit, FaSave } from "react-icons/fa";

interface LyricsProps {
  songId: string;
  initialLyrics?: string;
  isOwner: boolean;
}

const Lyrics: React.FC<LyricsProps> = ({ songId, initialLyrics, isOwner }) => {
  const { data: session } = useSession();
  const [lyrics, setLyrics] = useState(initialLyrics || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLyrics(initialLyrics || "");
  }, [initialLyrics]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!session?.user) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/songs/${songId}/lyrics`, { lyrics });
      setIsEditing(false);
      toast.success("Đã cập nhật lời bài hát");
    } catch (error) {
      toast.error("Không thể cập nhật lời bài hát");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lời bài hát</h2>
        {isOwner && (
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="text-white hover:text-green-500 transition"
            disabled={isLoading}
          >
            {isEditing ? <FaSave size={20} /> : <FaEdit size={20} />}
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="w-full h-64 p-4 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập lời bài hát ở đây..."
          disabled={isLoading}
        />
      ) : (
        <div className="bg-neutral-800 p-4 rounded-md whitespace-pre-line">
          {lyrics ? <p className="text-white">{lyrics}</p> : <p className="text-neutral-400">Chưa có lời bài hát</p>}
        </div>
      )}
    </div>
  );
};

export default Lyrics;
