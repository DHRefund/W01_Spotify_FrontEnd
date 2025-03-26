"use client";

import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaMusic, FaUsers, FaMicrophone } from "react-icons/fa";
import { useEffect } from "react";

import AdminHeader from "@/components/admin/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await getSession();
      console.log("Current session:", currentSession);

      if (status === "authenticated" && session?.user?.role !== "ADMIN") {
        router.push("/");
      }
    };

    checkSession();
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session?.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-900 p-6">
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
        <nav className="space-y-4">
          <Link href="/admin" className="flex items-center space-x-2 text-neutral-400 hover:text-white">
            <FaHome />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/songs" className="flex items-center space-x-2 text-neutral-400 hover:text-white">
            <FaMusic />
            <span>Quản lý bài hát</span>
          </Link>
          <Link href="/admin/artists" className="flex items-center space-x-2 text-neutral-400 hover:text-white">
            <FaMicrophone />
            <span>Quản lý nghệ sĩ</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-2 text-neutral-400 hover:text-white">
            <FaUsers />
            <span>Quản lý người dùng</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-black">
        <AdminHeader />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
