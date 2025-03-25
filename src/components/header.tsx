"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import Button from "./ui/button";
import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const handleUpload = () => {
    console.log("Upload button clicked");
    console.log("Session:", session?.user);

    if (!session?.user) {
      console.log("No user session, opening auth modal");
      return authModal.onOpen();
    }

    console.log("Opening upload modal");
    uploadModal.onOpen();
  };

  return (
    <div className={twMerge(`h-fit bg-gradient-to-b from-emerald-800 p-6`, className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            onClick={() => router.push("/search")}
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {session?.user ? (
            <>
              <Button onClick={handleUpload} className="bg-white px-6 py-2 cursor-pointer">
                <MdOutlineFileUpload size={20} className="mr-2" />
                Tải lên
              </Button>
              <div
                onClick={() => router.push("/account")}
                className="flex items-center gap-x-4 cursor-pointer hover:opacity-75 transition"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center overflow-hidden">
                  {session.user.image ? <img src={session.user.image} alt="Profile" /> : <FaUserAlt />}
                </div>
                <p className="text-white font-medium">{session.user.name}</p>
              </div>
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <div>
                <Button onClick={authModal.onOpen} className="bg-transparent text-neutral-300 font-medium">
                  Đăng ký
                </Button>
              </div>
              <div>
                <Button onClick={authModal.onOpen} className="bg-white px-6 py-2">
                  Đăng nhập
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
