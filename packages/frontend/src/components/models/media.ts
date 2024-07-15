export type Media = {
  id: number;
  name: string;
  path: string;
  extension: string;
  size: number;
  mimeType: string;
  inode: number;
  createdAt: Date;
  ModifiedAt: Date;
};

export type MediaCard = {
  id: number;
  name: string;
  description: string;
  type: string;
  category: string;
  releaseDate: Date;
  isActive: boolean;
  media: Media;
}