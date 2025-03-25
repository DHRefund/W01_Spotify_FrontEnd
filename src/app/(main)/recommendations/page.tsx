"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

import MediaItem from "@/components/media-item";
import LikeButton from "@/components/like-button";
import usePlayer from "@/hooks/usePlayer";

export default function RecommendationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const player = usePlayer();

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/play-history/recommendations");
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [session?.user, router]);

  const onPlay = (id: string) => {
    player.setId(id);
    player.setIds(recommendations.map((song) => song.id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="px-6">
        <div className="mt-20">
          <h1 className="text-white text-3xl font-bold">Đề xuất cho bạn</h1>
          <p className="text-neutral-400 mt-2">Dựa trên lịch sử nghe của bạn</p>
        </div>

        <div className="mt-10">
          {recommendations.length === 0 ? (
            <div className="text-neutral-400 text-center py-10">Nghe thêm nhạc để nhận đề xuất phù hợp hơn</div>
          ) : (
            <div className="flex flex-col gap-y-2">
              {recommendations.map((song) => (
                <div key={song.id} className="flex items-center gap-x-4 w-full">
                  <div className="flex-1">
                    <MediaItem data={song} onClick={(id: string) => onPlay(id)} />
                  </div>
                  <LikeButton songId={song.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
