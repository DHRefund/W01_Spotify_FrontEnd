"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface PlaylistCardProps {
  data: {
    id: string;
    title: string;
    imageUrl: string;
  };
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/playlist/${data.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
      "
    >
      <div
        className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        "
      >
        <Image className="object-cover" src={data.imageUrl || "/images/playlist-placeholder.png"} fill alt="Playlist" />
      </div>
      <div className="flex flex-col items-start w-full pt-4">
        <p className="font-semibold truncate w-full text-white">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">Playlist</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
