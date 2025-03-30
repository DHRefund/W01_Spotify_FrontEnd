"use client";

import { useState, useEffect, useRef } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BiRepeat } from "react-icons/bi";
import { BsShuffle } from "react-icons/bs";
import { Howl } from "howler";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import MediaItem from "./media-item";
import LikeButton from "./like-button";
import Slider from "./slider";
import usePlayer from "@/hooks/usePlayer";
import { useSong, useRecordPlay } from "@/hooks/useApi";

interface Song {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  artist: {
    name: string;
  };
}

const Player = () => {
  const player = usePlayer();
  const { data: session } = useSession({
    required: false,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchWhenOffline: false,
  });
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<"none" | "all" | "one">("none");
  const [shuffle, setShuffle] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sử dụng React Query
  const { data: song, isLoading: songLoading } = useSong(player.activeId);
  const { mutate: recordPlay } = useRecordPlay();

  const Icon = player.isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // Format thời gian từ giây sang mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Xử lý khi bài hát kết thúc
  const handleSongEnd = () => {
    if (repeat === "one") {
      // Repeat one: phát lại bài hiện tại
      soundRef.current?.seek(0);
      soundRef.current?.play();
    } else if (repeat === "all") {
      // Repeat all: phát bài tiếp theo, nếu là bài cuối thì quay lại bài đầu
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const nextSong = player.ids[currentIndex + 1];

      if (!nextSong) {
        // Nếu là bài cuối, quay lại bài đầu
        player.setId(player.ids[0]);
      } else {
        // Phát bài tiếp theo
        player.setId(nextSong);
      }
    } else if (shuffle) {
      // Nếu đang shuffle thì phát ngẫu nhiên
      onPlayRandom();
    } else {
      // Normal: phát bài tiếp theo nếu có
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const nextSong = player.ids[currentIndex + 1];

      if (nextSong) {
        player.setId(nextSong);
      } else {
        // Nếu là bài cuối và không repeat thì dừng
        player.setIsPlaying(false);
      }
    }
  };

  // Cập nhật useEffect khởi tạo Howl
  useEffect(() => {
    if (song?.url) {
      if (soundRef.current) {
        soundRef.current.unload();
      }

      soundRef.current = new Howl({
        src: [song.url],
        html5: true,
        volume: volume,
        onplay: () => {
          player.setIsPlaying(true);
          toast.success("Đã bắt đầu phát âm thanh");
          updateProgress();
        },
        onload: () => {
          const duration = soundRef.current?.duration() || 0;
          setDuration(duration);
          toast.success("Đã tải xong âm thanh");
          soundRef.current?.play();
        },
        onend: () => {
          player.setIsPlaying(false);
          clearInterval(progressRef.current);
          handleSongEnd();
        },
        onpause: () => {
          console.log("Sound paused");
          player.setIsPlaying(false);
          toast.success("Đã tạm dừng phát âm thanh");
        },
        onloaderror: () => {
          console.error("Loading error");
          toast.error("Lỗi khi tải âm thanh");
        },
        onplayerror: () => {
          console.error("Play error");
          toast.error("Lỗi khi phát âm thanh");
        },
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [song, volume]);

  // Cập nhật progress
  const updateProgress = () => {
    progressRef.current = setInterval(() => {
      if (soundRef.current) {
        const seek = soundRef.current.seek() || 0;
        setSeek(seek);
      }
    }, 1000);
  };

  // Ghi lại lịch sử khi bắt đầu phát
  useEffect(() => {
    if (player.isPlaying && session?.user && song?.id) {
      recordPlay(song.id);
    }
  }, [player.isPlaying, session?.user, song?.id, recordPlay]);

  // Xử lý volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const handlePlay = () => {
    if (!song || !soundRef.current) return;

    if (player.isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  // Phát ngẫu nhiên
  const onPlayRandom = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * player.ids.length);
    } while (randomIndex === currentIndex && player.ids.length > 1);

    player.setId(player.ids[randomIndex]);
  };

  // Toggle repeat mode
  const onRepeatClick = () => {
    setRepeat((current) => {
      switch (current) {
        case "none":
          return "all";
        case "all":
          return "one";
        case "one":
          return "none";
      }
    });
  };

  // Toggle shuffle
  const onShuffleClick = () => {
    setShuffle((current) => !current);
  };

  // Xử lý khi người dùng thay đổi progress
  const onSeek = (value: number) => {
    if (soundRef.current) {
      clearInterval(progressRef.current);
      soundRef.current.seek(value);
      setSeek(value);
      updateProgress();
    }
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    if (shuffle) {
      onPlayRandom();
      return;
    }

    if (repeat === "one") {
      // Repeat one: phát lại bài hiện tại
      soundRef.current?.seek(0);
      soundRef.current?.play();
      return;
    }

    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong && repeat === "all") {
      // Repeat all: quay lại bài đầu
      player.setId(player.ids[0]);
    } else if (nextSong) {
      // Còn bài tiếp theo
      player.setId(nextSong);
    }
    // Nếu không còn bài tiếp và không repeat all thì dừng
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  // Trả về UI component với dữ liệu từ React Query
  if (!song) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-[#181818] w-full py-2 h-[90px] border-t border-neutral-800">
      <div className="relative h-full max-w-[1400px] mx-auto px-4">
        <div className="grid h-full grid-cols-3 items-center">
          {/* Left section - Song info */}
          <div className="flex items-center gap-x-4 w-full max-w-[400px]">
            {songLoading ? (
              <div className="flex items-center gap-x-3">
                <div className="h-14 w-14 rounded bg-neutral-800 animate-pulse" />
                <div className="flex flex-col">
                  <p className="text-white truncate">Loading...</p>
                  <p className="text-xs text-neutral-400">Please wait</p>
                </div>
              </div>
            ) : song ? (
              <>
                <MediaItem data={song} />
                <LikeButton songId={song.id} />
              </>
            ) : (
              <div className="flex items-center gap-x-3">
                <div className="h-14 w-14 rounded bg-neutral-800" />
                <div className="flex flex-col">
                  <p className="text-white truncate">No track selected</p>
                  <p className="text-xs text-neutral-400">Choose a song to play</p>
                </div>
              </div>
            )}
          </div>

          {/* Center section - Controls */}
          <div className="flex flex-col items-center gap-y-1">
            {/* Player controls */}
            <div className="flex items-center justify-center gap-x-6">
              <button
                onClick={onShuffleClick}
                className={`transition-all focus:outline-none ${
                  shuffle ? "text-green-500" : "text-neutral-400 hover:text-white"
                }`}
              >
                <BsShuffle size={20} />
              </button>

              <button
                onClick={onPlayPrevious}
                className="text-neutral-400 hover:text-white transition focus:outline-none"
              >
                <AiFillStepBackward size={24} />
              </button>

              <button
                onClick={handlePlay}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 hover:scale-105 transition-all focus:outline-none"
              >
                <Icon size={22} className="text-black" />
              </button>

              <button onClick={onPlayNext} className="text-neutral-400 hover:text-white transition focus:outline-none">
                <AiFillStepForward size={24} />
              </button>

              <button
                onClick={onRepeatClick}
                className={`transition-all focus:outline-none relative ${
                  repeat === "none" ? "text-neutral-400 hover:text-white" : "text-green-500"
                }`}
              >
                <BiRepeat size={20} />
                {repeat === "one" && <span className="absolute -top-1 -right-2 text-[8px] text-green-500">1</span>}
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center w-full max-w-[520px] gap-x-2">
              <span className="text-[11px] text-neutral-400 min-w-[40px] text-right">{formatTime(seek)}</span>
              <Slider value={seek} onChange={onSeek} max={duration} disabled={!song} className="!h-7" />
              <span className="text-[11px] text-neutral-400 min-w-[40px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right section - Volume */}
          <div className="flex items-center justify-end pr-4 gap-x-2 w-full max-w-[200px] ml-auto">
            <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition focus:outline-none">
              <VolumeIcon size={20} />
            </button>
            <Slider
              value={volume}
              onChange={(value) => setVolume(value)}
              max={1}
              disabled={!song}
              className="w-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
