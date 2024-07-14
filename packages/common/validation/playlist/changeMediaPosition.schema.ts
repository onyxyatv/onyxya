import { z } from 'zod';

export const changeMediaPositionSchema = z.object({
  playlistId: z.number({ message: "PlaylistId must be a number" }),
  mediaId: z.number({ message: "mediaId must be a number" }),
  newPosition: z.number({ message: "position must be a number" }),
}).refine((data) => data !== undefined, {
  message: 'Missing data keys, need a mediaId and a playlistId',
  path: [],
});

export type ChangeMediaPosition = z.infer<typeof changeMediaPositionSchema>;