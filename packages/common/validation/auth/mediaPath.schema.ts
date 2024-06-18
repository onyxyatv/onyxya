import { z } from "zod";

export const mediaPathSchema = z.object({
  path: z.string().min(1).startsWith("/"),
});

export type MediaPath = z.infer<typeof mediaPathSchema>;
