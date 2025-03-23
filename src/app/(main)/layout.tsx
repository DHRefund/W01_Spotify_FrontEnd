"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Player from "@/components/player";
import Header from "@/components/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
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
    </div>
  );
}
