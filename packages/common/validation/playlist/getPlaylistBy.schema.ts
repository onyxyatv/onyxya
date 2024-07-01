import { z } from 'zod';

export const getPlaylistBySchema = z.object({
  userId: z.string().transform((id) => (Number.parseInt(id))).optional(),
  name: z.string().optional()
}).refine((data) => data !== undefined, {
  message: 'Missing parameters for the playlist research',
  path: [],
});

export type GetPlaylistBy = z.infer<typeof getPlaylistBySchema>;