export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  userId: string;
  songs?: Song[];
  createdAt: Date;
  updatedAt: Date;
}
