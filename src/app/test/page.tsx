// "use client";

// import { useState } from "react";
// // import useSound from "use-sound";
// import useSound from "use-sound";

// export default function TestPage() {
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Sử dụng một URL âm thanh công khai để test
//   const testUrl = "https://res.cloudinary.com/doxmn4ait/video/upload/v1742988005/songs/j4rfye4gkkb74dpyfpnh.mp3";

//   const [play, { stop }] = useSound(testUrl, {
//     onplay: () => {
//       console.log("Playing test sound");
//       setIsPlaying(true);
//     },
//     onend: () => {
//       console.log("Test sound ended");
//       setIsPlaying(false);
//     },
//   });

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-black">
//       <h1 className="text-2xl font-bold text-white mb-4">Test Sound Player</h1>
//       <button
//         onClick={() => {
//           console.log("isPlaying");
//           if (isPlaying) {
//             stop();
//             setIsPlaying(false);
//           } else {
//             play();
//           }
//         }}
//         className="bg-green-500 text-white px-4 py-2 rounded-full"
//       >
//         {isPlaying ? "Stop" : "Play Test Sound"}
//       </button>
//       <p className="text-white mt-4">Check console for logs</p>
//     </div>
//   );
// }
