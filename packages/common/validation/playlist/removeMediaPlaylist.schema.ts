import { z } from 'zod';

export const removeMediaPlaylistSchema = z.object({
  playlistId: z.string().transform((id) => (Number.parseInt(id))).refine((id) => !isNaN(id), {
    message: "playlistId must be a number"
  }),
  mediaId: z.string().transform((id) => (Number.parseInt(id))).refine((id) => !isNaN(id), {
    message: "mediaId must be a number"
  }),
}).refine((data) => data !== undefined, {
  message: 'Missing data keys, need a mediaId and a playlistId',
  path: [],
});

export type RemoveMediaPlaylist = z.infer<typeof removeMediaPlaylistSchema>;