"use client";

import { useState, useEffect } from "react";
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
import useUploadModal from "@/hooks/useUploadModal";

const uploadSchema = z.object({
  title: z.string().min(1, "Tên bài hát không được để trống"),
  artistId: z.string().min(1, "Nghệ sĩ không được để trống"),
  song: z.instanceof(File).refine((file) => file.size > 0, "File bài hát là bắt buộc"),
  image: z.instanceof(File).optional(),
  lyrics: z.string().optional(),
});

type UploadValues = z.infer<typeof uploadSchema>;

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit = async (values: UploadValues) => {
    try {
      setIsLoading(true);

      if (!session?.user) {
        toast.error("Bạn cần đăng nhập để tải lên bài hát");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("artistId", values.artistId);
      formData.append("song", values.song);
      if (values.image) {
        formData.append("image", values.image);
      }
      if (values.lyrics) {
        formData.append("lyrics", values.lyrics);
      }

      const response = await api.post("/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Đã tải lên bài hát thành công!");
      reset();
      uploadModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải lên bài hát");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch artists when modal opens
  useEffect(() => {
    if (uploadModal.isOpen) {
      api
        .get("/artists")
        .then((res) => {
          setArtists(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch artists", err);
        });
    }
  }, [uploadModal.isOpen]);

  return (
    <Modal
      title="Tải lên bài hát"
      description="Thêm bài hát mới vào thư viện của bạn"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title")}
          placeholder="Tên bài hát"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <select
          id="artistId"
          disabled={isLoading}
          {...register("artistId")}
          className={`
            w-full 
            p-3 
            rounded-md 
            bg-neutral-700 
            border 
            border-transparent 
            focus:border-white 
            focus:outline-none 
            ${errors.artistId ? "border-red-500" : ""}
          `}
        >
          <option value="">Chọn nghệ sĩ</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        {errors.artistId && <p className="text-red-500 text-sm">{errors.artistId.message}</p>}

        <div>
          <p className="text-sm mb-1">File bài hát (MP3)</p>
          <input
            id="song"
            type="file"
            accept=".mp3"
            disabled={isLoading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                register("song")(file);
              }
            }}
            className={`
              w-full 
              p-2 
              rounded-md 
              bg-neutral-700 
              border 
              border-transparent 
              focus:border-white 
              focus:outline-none 
              ${errors.song ? "border-red-500" : ""}
            `}
          />
          {errors.song && <p className="text-red-500 text-sm">{errors.song.message}</p>}
        </div>

        <div>
          <p className="text-sm mb-1">Ảnh bìa (tùy chọn)</p>
          <input
            id="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                register("image")(file);
              }
            }}
            className="
              w-full 
              p-2 
              rounded-md 
              bg-neutral-700 
              border 
              border-transparent 
              focus:border-white 
              focus:outline-none
            "
          />
        </div>

        <div>
          <p className="text-sm mb-1">Lời bài hát (tùy chọn)</p>
          <textarea
            id="lyrics"
            disabled={isLoading}
            {...register("lyrics")}
            placeholder="Nhập lời bài hát ở đây..."
            className="
              w-full 
              h-32
              p-2 
              rounded-md 
              bg-neutral-700 
              border 
              border-transparent 
              focus:border-white 
              focus:outline-none
            "
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Tải lên
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
