"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import usePlayer from "@/hooks/usePlayer";

interface SongCardProps {
  data: {
    id: string;
    title: string;
    artist: {
      name: string;
    };
    imageUrl: string;
    url?: string;
  };
}

const SongCard: React.FC<SongCardProps> = ({ data }) => {
  const player = usePlayer();
  const router = useRouter();

  const handleClick = () => {
    if (!data.url) {
      console.log("Song clicked:", data);
      router.push(`/song/${data.id}`);
      return;
    }

    console.log("xem", player);
    player.setId(data.id);
    player.setIds([data.id]);
    console.log("Playing song:", data);
    console.log("player", player);
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
        gap-x-4 
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
        <Image className="object-cover" src={data.imageUrl || "/images/music-placeholder.png"} fill alt="Image" />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full text-white">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">{data.artist?.name || "Unknown Artist"}</p>
      </div>
      <div
        className="
          absolute 
          bottom-24 
          right-5
        "
      >
        <div
          className="
            flex 
            items-center 
            justify-center 
            rounded-full 
            bg-green-500 
            p-4 
            drop-shadow-md 
            opacity-0 
            group-hover:opacity-100 
            hover:scale-110 
            transition
          "
        >
          <FaPlay className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default SongCard;
