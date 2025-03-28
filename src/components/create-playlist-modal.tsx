// "use client";

// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import uniqid from "uniqid";

// import Modal from "./modal";
// import Input from "./input";
// import Button from "./button";
// import api from "@/lib/axios";
// import { useUploadModal } from "@/hooks/useUploadModal";

// const CreatePlaylistModal = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();
//   const uploadModal = useUploadModal();

//   const { register, handleSubmit, reset } = useForm<FieldValues>({
//     defaultValues: {
//       name: "",
//       description: "",
//       image: null,
//     },
//   });

//   const onChange = (open: boolean) => {
//     if (!open) {
//       reset();
//       uploadModal.onClose();
//     }
//   };

//   const onSubmit: SubmitHandler<FieldValues> = async (values) => {
//     try {
//       setIsLoading(true);

//       const imageFile = values.image?.[0];
//       const playlistId = uniqid();

//       // Upload image if provided
//       let imageUrl = "";
//       if (imageFile) {
//         const formData = new FormData();
//         formData.append("file", imageFile);
//         formData.append("upload_preset", "your_cloudinary_preset");

//         const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
//           method: "POST",
//           body: formData,
//         });
//         const uploadData = await uploadRes.json();
//         imageUrl = uploadData.secure_url;
//       }

//       // Create playlist
//       const { data } = await api.post("/playlists", {
//         id: playlistId,
//         name: values.name,
//         description: values.description,
//         imageUrl: imageUrl || null,
//       });

//       toast.success("Playlist created!");
//       reset();
//       uploadModal.onClose();
//       router.refresh();
//       router.push(`/playlist/${data.id}`);
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title="Create a new playlist"
//       description="Add your playlist details"
//       isOpen={uploadModal.isOpen}
//       onChange={onChange}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
//         <Input id="name" disabled={isLoading} {...register("name", { required: true })} placeholder="Playlist name" />
//         <Input
//           id="description"
//           disabled={isLoading}
//           {...register("description")}
//           placeholder="Description (optional)"
//         />
//         <div>
//           <div className="pb-1">Choose an image (optional)</div>
//           <Input id="image" type="file" disabled={isLoading} accept="image/*" {...register("image")} />
//         </div>
//         <Button disabled={isLoading} type="submit">
//           Create
//         </Button>
//       </form>
//     </Modal>
//   );
// };

// export default CreatePlaylistModal;
