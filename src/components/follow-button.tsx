"use client";

import { useEffect, useState } from "react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface FollowButtonProps {
  artistId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ artistId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session?.user || !artistId) {
      return;
    }

    // Check if user is following the artist
    const checkFollowing = async () => {
      try {
        const { data } = await api.get(`/artists/${artistId}/follow`);
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error(error);
      }
    };

    checkFollowing();
  }, [session?.user, artistId]);

  const handleFollow = async () => {
    if (!session?.user) {
      return router.push("/login");
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/artists/${artistId}/follow`);
        setIsFollowing(false);
        toast.success("Đã bỏ theo dõi nghệ sĩ");
      } else {
        await api.post(`/artists/${artistId}/follow`);
        setIsFollowing(true);
        toast.success("Đã theo dõi nghệ sĩ");
      }
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isFollowing ? FaUserCheck : FaUserPlus;

  return (
    <button
      onClick={handleFollow}
      className={`
        flex 
        items-center 
        gap-x-2
        rounded-full 
        px-4 
        py-2 
        font-semibold 
        transition
        ${isFollowing ? "bg-neutral-800 text-white hover:bg-neutral-700" : "bg-white text-black hover:bg-neutral-200"}
      `}
      disabled={isLoading}
    >
      <Icon size={20} />
      <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
    </button>
  );
};

export default FollowButton;
