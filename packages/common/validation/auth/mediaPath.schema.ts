import { z } from "zod";

export const mediaPathSchema = z.object({
  path: z.string({
    message: "Path must be a string",
  }).min(1, 
    { message: "Path must be at least 1 character" }
  ).max(255, 
    { message: "Path must be at most 255 characters" }
  ).startsWith("/", 
    { message: "Path must start with /" }
  ),
});

export type MediaPath = z.infer<typeof mediaPathSchema>;
