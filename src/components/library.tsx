"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import MediaItem from "./media-item";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

import { useUserPlaylists } from "@/hooks/useApi";
const Library = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const createPlaylistModal = useCreatePlaylistModal();

  const { data: userPlaylists = [] } = useUserPlaylists();

  useEffect(() => {
    if (userPlaylists) {
      setPlaylists(userPlaylists);
    }
  }, [userPlaylists]);

  const onClick = () => {
    if (!session?.user) {
      return router.push("/login");
    }

    // Open create playlist modal
    createPlaylistModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Thư viện của bạn</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="
            cursor-pointer 
            text-neutral-400 
            transition 
            hover:text-white
          "
        />
      </div>
      <div className="mt-4 px-3 flex flex-col gap-y-2">
        {playlists.length === 0 && <div className="text-neutral-400 text-sm px-2">Bạn chưa có playlist nào</div>}
        {playlists.map((playlist) => (
          <MediaItem key={playlist.id} data={playlist} onClick={() => router.push(`/playlist/${playlist.id}`)} />
        ))}
      </div>
    </div>
  );
};

export default Library;
