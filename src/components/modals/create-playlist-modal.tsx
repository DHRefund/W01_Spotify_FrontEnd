"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useCreatePlaylist } from "@/hooks/useApi";

import Modal from "@/components/modals/modal";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

const CreatePlaylistModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createPlaylistModal = useCreatePlaylistModal();
  const createPlaylistMutation = useCreatePlaylist(); // Di chuyển hook lên top-level

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      createPlaylistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) formData.append("description", values.description);
    if (values.image?.[0]) formData.append("image", values.image[0]);
    createPlaylistMutation.mutate(formData);
    reset();
    createPlaylistModal.onClose();
  };

  return (
    <Modal
      title="Tạo playlist mới"
      description="Thêm thông tin cho playlist của bạn"
      isOpen={createPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input id="title" disabled={isLoading} {...register("title", { required: true })} placeholder="Tên playlist" />
        <Input
          id="description"
          disabled={isLoading}
          {...register("description")}
          placeholder="Mô tả (không bắt buộc)"
        />
        <div>
          <div className="pb-1">Chọn ảnh (không bắt buộc)</div>
          <Input id="image" type="file" disabled={isLoading} accept="image/*" {...register("image")} />
        </div>
        {isLoading ? (
          <Button disabled={isLoading} type="submit">
            Đang tạo playlist...
          </Button>
        ) : (
          <Button disabled={isLoading} type="submit">
            Tạo playlist
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default CreatePlaylistModal;
