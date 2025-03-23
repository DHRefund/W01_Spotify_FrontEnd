"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    // Check if the song is liked
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/liked?songId=${songId}`);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [songId, session?.user]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!session?.user) {
      return router.push("/login");
    }

    try {
      if (isLiked) {
        await api.delete(`/liked?songId=${songId}`);
      } else {
        await api.post("/liked", { songId });
      }

      setIsLiked(!isLiked);
      router.refresh();
      toast.success(isLiked ? "Đã bỏ thích" : "Đã thích");
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <button
      onClick={handleLike}
      className="
        hover:opacity-75 
        transition
      "
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
