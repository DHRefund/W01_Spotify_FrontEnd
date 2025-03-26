"use client";

import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="h-16 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between">
      <h2 className="text-white text-xl">Quản lý hệ thống</h2>

      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-2 text-green-500">
          <FaUser />
          <span>{session?.user?.name || "Admin"}</span>
        </div>

        <button onClick={() => signOut()} className="flex items-center gap-x-2 text-neutral-400 hover:text-white">
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
