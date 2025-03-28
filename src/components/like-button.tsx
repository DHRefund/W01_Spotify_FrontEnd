"use client";

import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import useAuthModal from "@/hooks/useAuthModal";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const authModal = useAuthModal();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const checkIfLiked = async () => {
      try {
        console.log("Checking if song is liked:", songId);
        const response = await api.get(`/songs/${songId}/liked`);
        console.log("Like status:", response.data);
        setIsLiked(response.data.liked);
      } catch (error) {
        console.error("Error checking if song is liked:", error);
      }
    };

    checkIfLiked();
  }, [songId, session?.user]);

  const handleLike = async () => {
    if (!session?.user) {
      return authModal.onOpen();
    }

    try {
      console.log("Toggling like for song:", songId);
      const response = await api.post(`/songs/${songId}/like`);
      console.log("Toggle like response:", response.data);
      setIsLiked(response.data.liked);

      router.refresh();
      toast.success(isLiked ? "Đã bỏ thích" : "Đã thích");
    } catch (error) {
      console.error("Error liking song:", error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
