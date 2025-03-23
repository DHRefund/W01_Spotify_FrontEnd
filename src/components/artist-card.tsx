"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArtistCardProps {
  data: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

const ArtistCard: React.FC<ArtistCardProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artist/${data.id}`);
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
          rounded-full 
          overflow-hidden
        "
      >
        <Image className="object-cover" src={data.imageUrl || "/images/artist-placeholder.png"} fill alt="Artist" />
      </div>
      <div className="flex flex-col items-start w-full pt-4">
        <p className="font-semibold truncate w-full text-center text-white">{data.name}</p>
        <p className="text-neutral-400 text-sm pb-4 w-full text-center truncate">Nghệ sĩ</p>
      </div>
    </div>
  );
};

export default ArtistCard;
