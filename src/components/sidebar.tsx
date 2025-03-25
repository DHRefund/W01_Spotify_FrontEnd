"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RiPlayListFill } from "react-icons/ri";
import { MdFavorite, MdRecommend } from "react-icons/md";

import Box from "./ui/box";
import SidebarItem from "./sidebar-item";
import Library from "./library";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Trang chủ",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Tìm kiếm",
        active: pathname === "/search",
        href: "/search",
      },
      {
        icon: MdRecommend,
        label: "Đề xuất",
        active: pathname === "/recommendations",
        href: "/recommendations",
      },
      {
        icon: MdFavorite,
        label: "Yêu thích",
        active: pathname === "/liked",
        href: "/liked",
      },
      {
        icon: RiPlayListFill,
        label: "Playlist của tôi",
        active: pathname === "/playlists",
        href: "/playlists",
      },
    ],
    [pathname]
  );

  return (
    <div className="flex h-full">
      <div className="hidden h-full w-[300px] flex-col gap-y-2 bg-black p-2 md:flex">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="h-full overflow-y-auto">
          <Library />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};

export default Sidebar;
