"use client";

import { useState } from "react";
import { FaShare } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ShareButtonProps {
  type: "song" | "playlist";
  id: string;
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ type, id, title }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleShare = async () => {
    setIsLoading(true);
    try {
      // Tạo URL để chia sẻ
      const shareUrl = `${window.location.origin}/${type}/${id}`;

      // Sử dụng Web Share API nếu có hỗ trợ
      if (navigator.share) {
        await navigator.share({
          title: `Nghe "${title}" trên Spotify Clone`,
          text: `Hãy nghe "${title}" trên Spotify Clone!`,
          url: shareUrl,
        });
        toast.success("Đã chia sẻ thành công!");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Đã sao chép liên kết vào clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Không thể chia sẻ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleShare} className="text-neutral-400 hover:text-white transition" disabled={isLoading}>
      <FaShare size={20} />
    </button>
  );
};

export default ShareButton;
