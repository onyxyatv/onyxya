import { z } from 'zod';

export const addMediaPlaylistSchema = z.object({
  playlistId: z.number(),
  mediaId: z.number(),
}).refine((data) => data !== undefined, {
  message: 'Missing data keys, need a mediaId and a playlistId',
  path: [],
});

export type AddMediaPlaylist = z.infer<typeof addMediaPlaylistSchema>;