import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Hook cho bài hát
export function useSong(songId: string | undefined) {
  return useQuery({
    queryKey: ["songs", songId],
    queryFn: () => api.get(`/songs/${songId}`).then((res) => res.data),
    enabled: !!songId,
  });
}

// Hook cho danh sách bài hát gần đây
export function useRecentSongs() {
  return useQuery({
    queryKey: ["songs", "recent"],
    queryFn: () => api.get("/songs/recent").then((res) => res.data),
  });
}

// Hook cho playlists được đề xuất
export function useRecommendedPlaylists() {
  return useQuery({
    queryKey: ["playlists", "recommended"],
    queryFn: () => api.get("/playlists/recommended").then((res) => res.data),
  });
}

// Hook cho nghệ sĩ nổi bật
export function useTopArtists() {
  return useQuery({
    queryKey: ["artists", "top"],
    queryFn: () => api.get("/artists/top").then((res) => res.data),
  });
}

// Hook cho tìm kiếm
export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => api.get(`/search?query=${encodeURIComponent(query)}`).then((res) => res.data),
    enabled: query.length > 1,
  });
}

// Hook để lấy danh sách bài hát yêu thích của người dùng
export function useUserLikedSongs() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["liked-songs"],
    queryFn: () => api.get(`/me/liked-songs`).then((res) => res.data),
    enabled: !!session?.user,
  });
}

// Hook để thích bài hát
export function useLikeSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) => {
      // Kiểm tra nếu bài hát đã được like, thực hiện unlike
      const likedSongs = queryClient.getQueryData<any[]>(["liked-songs"]) || [];
      const isLiked = likedSongs.some((song) => song.id === songId);

      if (isLiked) {
        return api.delete(`/songs/${songId}/like`);
      } else {
        return api.post(`/songs/${songId}/like`);
      }
    },
    onSuccess: () => {
      // Invalidate các queries liên quan khi like/unlike thành công
      queryClient.invalidateQueries({ queryKey: ["liked-songs"] });
    },
  });
}

// Hook để ghi lại lịch sử phát
export function useRecordPlay() {
  return useMutation({
    mutationFn: (songId: string) => api.post(`/songs/${songId}/play`),
  });
}

// Hook để upload bài hát
export function useUploadSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      // Invalidate các queries liên quan khi upload thành công
      queryClient.invalidateQueries({ queryKey: ["songs", "recent"] });
      toast.success("Đã tải lên bài hát mới");
    },
    onError: () => {
      toast.error("Không thể tải lên bài hát");
    },
  });
}
