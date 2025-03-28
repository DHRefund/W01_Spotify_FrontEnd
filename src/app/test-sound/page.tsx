"use client";
import { useState } from "react";
import useSound from "use-sound";
import { toast } from "react-hot-toast";
import { Howl, Howler } from "howler";

export default function TestSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useState<string | null>(null);

  const sound = new Howl({
    src: [songUrl || ""],
  });

  //   const [play, { pause, sound }] = useSound(songUrl || "", {
  //     volume: 1,
  //     format: ["mp3"],
  //     onload: () => {
  //       console.log("Sound loaded successfully");
  //       toast.success("Đã tải xong âm thanh");
  //     },
  //     onplay: () => {
  //       console.log("Playing sound");
  //       setIsPlaying(true);
  //       console.log("Play", play);
  //       console.log("Sound", sound);
  //       toast.success("Đang phát nhạc");
  //     },
  //     onend: () => {
  //       console.log("Sound ended");
  //       setIsPlaying(false);
  //     },
  //     onpause: () => {
  //       console.log("Sound paused");
  //       setIsPlaying(false);
  //     },
  //     onloaderror: (_, error) => {
  //       console.error("Loading error:", error);
  //       toast.error("Lỗi khi tải âm thanh");
  //     },
  //     onplayerror: (_, error) => {
  //       console.error("Play error:", error);
  //       toast.error("Lỗi khi phát âm thanh");
  //     },
  //   });

  const handleSetSong = () => {
    const url = "https://res.cloudinary.com/doxmn4ait/video/upload/v1742988005/songs/j4rfye4gkkb74dpyfpnh.mp3";
    console.log("Setting song URL");
    setSongUrl(url);
  };

  const handleClick = () => {
    if (!songUrl) {
      toast.error("Vui lòng chọn bài hát trước");
      return;
    }

    if (isPlaying) {
      sound.pause();
    } else {
      console.log("Attempting to play:", songUrl);
      sound.play();
      console.log("Play", sound);
      console.log("Sound", sound);
    }
  };

  return (
    <div className="flex space-x-4">
      <button onClick={handleSetSong} className="bg-blue-500 text-white px-4 py-2 rounded">
        Set nhạc
      </button>
      <button onClick={handleClick} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!songUrl}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
