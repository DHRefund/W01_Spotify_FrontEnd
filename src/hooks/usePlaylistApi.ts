import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

// Hook lấy danh sách playlist của người dùng
export function useUserPlaylists() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["playlists", "user"],
    queryFn: () => api.get(`/me/playlists`).then((res) => res.data),
    enabled: !!session?.user,
  });
}

// Hook tạo playlist mới
export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistData: { title: string; description?: string }) =>
      api.post(`/playlists`, playlistData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists", "user"] });
      toast.success("Đã tạo playlist mới");
    },
    onError: () => {
      toast.error("Không thể tạo playlist");
    },
  });
}

// Hook cập nhật playlist
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; title: string; description?: string }) =>
      api.patch(`/playlists/${data.id}`, {
        title: data.title,
        description: data.description,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlists", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["playlists", "user"] });
      toast.success("Đã cập nhật playlist");
    },
    onError: () => {
      toast.error("Không thể cập nhật playlist");
    },
  });
}

// Hook thêm bài hát vào playlist
export function useAddSongToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      api.post(`/playlists/${playlistId}/songs`, { songId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlists", variables.playlistId] });
      toast.success("Đã thêm bài hát vào playlist");
    },
    onError: () => {
      toast.error("Không thể thêm bài hát");
    },
  });
}

// Hook tìm kiếm bài hát
export function useSearchSongs(query: string) {
  return useQuery({
    queryKey: ["search", "songs", query],
    queryFn: () => api.get(`/search?type=songs&query=${encodeURIComponent(query)}`).then((res) => res.data.songs),
    enabled: query.length > 1,
  });
}
