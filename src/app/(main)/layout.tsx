"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Player from "@/components/player";
import Header from "@/components/header";
import CreatePlaylistModal from "@/components/modals/create-playlist-modal";
import UploadModal from "@/components/modals/upload-modal";
import AddSongToPlaylistModal from "@/components/modals/add-song-to-playlist-modal";
// import AuthModal from "@/components/modals/auth-modal";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("status", status);
    if (status === "unauthenticated") {
      router.push("/login");
      console.log("pushing to login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black">
      <div className="flex h-full">
        <Sidebar />
        <main className="h-full flex-1 overflow-y-auto py-2">
          <Header />
          <div className="px-6">{children}</div>
        </main>
      </div>
      <div className="fixed bottom-0 h-[80px] w-full bg-black">
        <Player />
      </div>
      {/* <AuthModal /> */}
      <UploadModal />
      <CreatePlaylistModal />
      <AddSongToPlaylistModal />
    </div>
  );
}
