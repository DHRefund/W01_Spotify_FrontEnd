"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "./modal";
import Input from "../ui/input";
import Button from "../ui/button";
import api from "@/lib/axios";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

const createPlaylistSchema = z.object({
  title: z.string().min(1, "Tên playlist không được để trống"),
  description: z.string().optional(),
});

type CreatePlaylistValues = z.infer<typeof createPlaylistSchema>;

const CreatePlaylistModal = () => {
  const createPlaylistModal = useCreatePlaylistModal();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistValues>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      createPlaylistModal.onClose();
    }
  };

  const onSubmit = async (values: CreatePlaylistValues) => {
    try {
      setIsLoading(true);

      if (!session?.user) {
        toast.error("Bạn cần đăng nhập để tạo playlist");
        return;
      }

      const response = await api.post("/playlists", values);

      toast.success("Đã tạo playlist thành công!");
      reset();
      createPlaylistModal.onClose();
      router.refresh();

      // Chuyển hướng đến trang playlist mới tạo
      router.push(`/playlist/${response.data.id}`);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Playlist mới"
      description="Thêm một playlist mới vào thư viện của bạn"
      isOpen={createPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title")}
          placeholder="Tên playlist"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <Input id="description" disabled={isLoading} {...register("description")} placeholder="Mô tả (tùy chọn)" />

        <Button disabled={isLoading} type="submit">
          Tạo
        </Button>
      </form>
    </Modal>
  );
};

export default CreatePlaylistModal;
