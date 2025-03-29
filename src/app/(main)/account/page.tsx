"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Image from "next/image";
import LoadingSpinner from "@/components/loading-spinner";

export default function AccountPage() {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Sử dụng React Query để lấy dữ liệu người dùng
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => api.get("/me").then((res) => res.data),
    enabled: !!session?.user,
    onSuccess: (data) => {
      setName(data.name || "");
    },
  });

  // Mutation để cập nhật profile
  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: (formData: FormData) => api.patch("/me", formData),
    onSuccess: async () => {
      // Cập nhật session để hiển thị thông tin mới
      await updateSession({ name });

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Đã cập nhật thông tin cá nhân");
    },
    onError: () => {
      toast.error("Không thể cập nhật thông tin");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    updateProfile(formData);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="md:px-20 px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-white text-3xl font-semibold mb-6">Thông tin tài khoản</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative h-32 w-32">
              <Image
                fill
                src={previewUrl || userData?.imageUrl || "/images/user-placeholder.png"}
                alt="Profile"
                className="object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer">
                <label htmlFor="image-upload" className="cursor-pointer text-white text-xs text-center p-2">
                  Đổi ảnh
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="text-neutral-400 text-sm">Email</label>
                <Input value={session?.user?.email || ""} disabled className="bg-neutral-800 disabled:opacity-70" />
              </div>

              <div>
                <label className="text-neutral-400 text-sm">Tên hiển thị</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                  className="bg-neutral-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-green-500 hover:bg-green-600 px-6" disabled={isUpdating}>
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
