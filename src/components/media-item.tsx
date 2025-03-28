"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface MediaItemProps {
  data: {
    id: string;
    title: string;
    artist?: {
      name: string;
    };
    imageUrl: string;
  };
  onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    // Default behavior
    router.push(`/song/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        flex 
        items-center 
        gap-x-3 
        cursor-pointer 
        hover:bg-neutral-800/50 
        w-full 
        p-2 
        rounded-md
      "
    >
      <div
        className="
          relative 
          rounded-md 
          min-h-[48px] 
          min-w-[48px] 
          overflow-hidden
        "
      >
        <Image fill src={data.imageUrl || "/images/music-placeholder.png"} alt={data.title} className="object-cover" />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.artist?.name || "Unknown Artist"}</p>
      </div>
    </div>
  );
};

export default MediaItem;
