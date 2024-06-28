import { z } from "zod";

enum MediaType {
  "music",
  "film",
  "series",
}

enum MediaCategory {
  // Music
  "Pop",
  "Rock",
  "Hip-Hop",
  "Jazz",
  "Classical",
  "Electronic",
  "Reggae",
  "Blues",
  "Country",
  "R&B",
  "Folk",
  "Latin",
  "Soul",
  "Metal",
  "Punk",
  "Disco",
  "Funk",
  "Gospel",
  "House",
  "Techno",
  "Trance",
  "Dubstep",
  "Drum and Bass",
  "Ska",
  "Grunge",
  "Alternative",
  "Indie",
  "K-Pop",
  "Reggaeton",
  "Salsa",
  "Afrobeat",
  "Dancehall",
  "Trap",
  "Emo",
  "Ambient",
  "New Age",
  "Chillout",
  "Lo-fi",
  "Synthpop",
  "Hardcore",

  // Film
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Sport",
  "Thriller",
  "War",
  "Western"
}

export const editMediaCardSchema = z.object({
  id: z.number({ message: "ID must be a number" }),
  name: z
    .string({ message: "Name must be a string" })
    .min(1, { message: "Name must be at least 1 character" })
    .max(255, { message: "Name must be at most 255 characters" })
    .optional(),
  description: z
    .string({ message: "Description must be a string" })
    .min(1, { message: "Description must be at least 1 character" })
    .max(255, { message: "Description must be at most 255 characters" })
    .optional(),
  type: z
    .nativeEnum(MediaType, {
      message: "Type must be one of 'music', 'film', 'series'",
    })
    .optional(),
  category: z
    .nativeEnum(MediaCategory, {
      message: "Category must be one of the available categories",
    })
    .optional(),
  release: z.date().optional(),
});

export type EditMediaCard = z.infer<typeof editMediaCardSchema>;
