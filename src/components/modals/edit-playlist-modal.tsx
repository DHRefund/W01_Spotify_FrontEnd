"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "./modal";
import Input from "../ui/input";
import Button from "../ui/button";
import api from "@/lib/axios";
import useEditPlaylistModal from "@/hooks/useEditPlaylistModal";

const editPlaylistSchema = z.object({
  title: z.string().min(1, "Tên playlist không được để trống"),
  description: z.string().optional(),
});

type EditPlaylistValues = z.infer<typeof editPlaylistSchema>;

const EditPlaylistModal = () => {
  const editPlaylistModal = useEditPlaylistModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPlaylistValues>({
    resolver: zodResolver(editPlaylistSchema),
    defaultValues: {
      title: editPlaylistModal.playlistData.title,
      description: editPlaylistModal.playlistData.description,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      editPlaylistModal.onClose();
    }
  };

  const onSubmit = async (values: EditPlaylistValues) => {
    try {
      setIsLoading(true);

      await api.put(`/playlists/${editPlaylistModal.playlistData.id}`, values);

      toast.success("Đã cập nhật playlist thành công!");
      reset();
      editPlaylistModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Playlist"
      description="Thay đổi thông tin playlist của bạn"
      isOpen={editPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title")}
          placeholder="Tên playlist"
          className={errors.title ? "border-red-500" : ""}
          defaultValue={editPlaylistModal.playlistData.title}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <Input
          id="description"
          disabled={isLoading}
          {...register("description")}
          placeholder="Mô tả (tùy chọn)"
          defaultValue={editPlaylistModal.playlistData.description}
        />

        <Button disabled={isLoading} type="submit">
          Lưu thay đổi
        </Button>
      </form>
    </Modal>
  );
};

export default EditPlaylistModal;
