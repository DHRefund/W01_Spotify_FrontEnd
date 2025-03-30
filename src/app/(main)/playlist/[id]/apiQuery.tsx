import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { createAuthenticatedApi } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useDeletePlaylist(id: string) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();
  return useMutation({
    mutationFn: () => {
      const api = createAuthenticatedApi(accessToken);
      return api.delete(`/playlists/${id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa playlist");
      router.push("/");
    },
    onError: () => {
      toast.error("Không thể xóa playlist");
    },
  });
}
