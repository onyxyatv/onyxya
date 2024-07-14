import { z } from "zod";

export enum MediaType {
  Music = "Music",
  Film = "Film",
  Series = "Series",
}

export enum MediaCategory {
  // Music
  Pop = "Pop",
  Rock = "Rock",
  HipHop = "Hip-Hop",
  Jazz = "Jazz",
  Classical = "Classical",
  Electronic = "Electronic",
  Reggae = "Reggae",
  Blues = "Blues",
  Country = "Country",
  RB = "R&B",
  Folk = "Folk",
  Latin = "Latin",
  Soul = "Soul",
  Metal = "Metal",
  Punk = "Punk",
  Disco = "Disco",
  Funk = "Funk",
  Gospel = "Gospel",
  House = "House",
  Techno = "Techno",
  Trance = "Trance",
  Dubstep = "Dubstep",
  DrumAndBass = "Drum and Bass",
  Ska = "Ska",
  Grunge = "Grunge",
  Alternative = "Alternative",
  Indie = "Indie",
  KPop = "K-Pop",
  Reggaeton = "Reggaeton",
  Salsa = "Salsa",
  Afrobeat = "Afrobeat",
  Dancehall = "Dancehall",
  Trap = "Trap",
  Emo = "Emo",
  Ambient = "Ambient",
  NewAge = "New Age",
  Chillout = "Chillout",
  Lofi = "Lo-fi",
  Synthpop = "Synthpop",
  Hardcore = "Hardcore",

  // Film
  Action = "Action",
  Adventure = "Adventure",
  Animation = "Animation",
  Biography = "Biography",
  Comedy = "Comedy",
  Crime = "Crime",
  Documentary = "Documentary",
  Drama = "Drama",
  Family = "Family",
  Fantasy = "Fantasy",
  History = "History",
  Horror = "Horror",
  Musical = "Musical",
  Mystery = "Mystery",
  Romance = "Romance",
  ScienceFiction = "Science Fiction",
  Sport = "Sport",
  Thriller = "Thriller",
  War = "War",
  Western = "Western",
}

export const mediaCardSchema = z.object({
  id: z.number({ message: "ID must be a number" }).optional(),
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
  type: z.nativeEnum(MediaType, {
    message: "Type must be music, film or series",
  }),
  category: z
    .nativeEnum(MediaCategory, {
      message: "Category must be one of the available categories",
    })
    .optional(),
  releaseDate: z.coerce
    .date({
      message: "Release date must be a date",
    })
    .optional(),
  isActive: z
    .preprocess(
      (value) => {
        if (typeof value === "string") return value === "true";
        return value;
      },
      z.boolean({ message: "isActive must be a boolean" })
    )
    .optional(),
});

export type MediaCard = z.infer<typeof mediaCardSchema>;
