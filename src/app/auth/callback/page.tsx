"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Lưu token vào localStorage hoặc cookie nếu cần
      localStorage.setItem("spotify_token", token);

      // Chuyển hướng về trang chủ
      router.push("/");
    } else if (status === "authenticated") {
      router.push("/");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [token, status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Đang xử lý đăng nhập...</h2>
        <div className="mt-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
