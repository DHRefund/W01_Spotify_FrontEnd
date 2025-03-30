"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useLikeSong, useUserLikedSongs } from "@/hooks/useApi";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);

  // Sử dụng React Query để lấy danh sách bài hát được thích
  const { data: likedSongs, isLoading } = useUserLikedSongs();

  // Sử dụng React Query mutation để thích/bỏ thích bài hát
  const { mutate: likeMutate, isPending: isLiking } = useLikeSong();

  useEffect(() => {
    if (!likedSongs) return;

    const liked = likedSongs.some((song) => song.id === songId);
    setIsLiked(liked);
  }, [likedSongs, songId]);

  const handleLike = () => {
    if (!session?.user) {
      return router.push("/login");
    }

    likeMutate(songId, {
      onSuccess: () => {
        setIsLiked(!isLiked);
        toast.success(isLiked ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích");
      },
      onError: () => {
        toast.error("Đã xảy ra lỗi");
      },
    });
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;
  const color = isLiked ? "text-green-500" : "text-neutral-400";

  return (
    <button onClick={handleLike} className={`hover:opacity-75 transition ${color}`} disabled={isLoading || isLiking}>
      <Icon size={24} />
    </button>
  );
};

export default LikeButton;
