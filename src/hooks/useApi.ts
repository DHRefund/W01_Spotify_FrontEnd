import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { createAuthenticatedApi } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Hook cho bài hát
export function useSong(songId: string | undefined) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["songs", songId],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get(`/songs/${songId}`).then((res) => res.data);
    },
    enabled: !!songId,
  });
}

// Hook cho danh sách bài hát gần đây
export function useRecentSongs() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["songs", "recent"],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get("/songs/recent").then((res) => res.data);
    },
  });
}

// Hook cho playlists được đề xuất
export function useRecommendedPlaylists() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["playlists", "recommended"],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get("/playlists/recommended").then((res) => res.data);
    },
  });
}

// Hook cho nghệ sĩ nổi bật
export function useTopArtists() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["artists", "top"],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get("/artists/top").then((res) => res.data);
    },
  });
}

// Hook cho tìm kiếm
export function useSearch(query: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get(`/search?query=${encodeURIComponent(query)}`).then((res) => res.data);
    },
    enabled: query.length > 1,
  });
}

// Hook để lấy danh sách bài hát yêu thích của người dùng
export function useUserLikedSongs() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["liked-songs"],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get(`/songs/user/liked`).then((res) => res.data);
    },
    enabled: !!session?.user,
  });
}

// Hook để thích bài hát
export function useLikeSong() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useMutation({
    mutationFn: (songId: string) => {
      const api = createAuthenticatedApi(accessToken);
      // Kiểm tra nếu bài hát đã được like, thực hiện unlike
      const likedSongs = queryClient.getQueryData<any[]>(["liked-songs"]) || [];
      const isLiked = likedSongs.some((song) => song.id === songId);

      if (isLiked) {
        return api.post(`/songs/${songId}/like`);
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
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useMutation({
    mutationFn: (songId: string) => {
      const api = createAuthenticatedApi(accessToken);
      return api.post(`/songs/${songId}/play`);
    },
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
export function useUserPlaylists() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useQuery({
    queryKey: ["playlists"],
    queryFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.get(`/playlists/user/${session?.user?.id}`).then((res) => res.data);
    },
    enabled: !!session?.user,
    // initialData: [],
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  return useMutation({
    mutationFn: (formData: FormData) => {
      const api = createAuthenticatedApi(accessToken);
      return api.post("/playlists", formData);
    },
    onSuccess: (data) => {
      toast.success("Tạo playlist thành công!");
      queryClient.invalidateQueries({ queryKey: ["playlists"], exact: false });
      router.push(`/playlist/${data.data.id}`);
    },
    onError: () => {
      toast.error("Không thể tạo playlist");
    },
  });
}
