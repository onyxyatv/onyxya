import { z } from 'zod';
import {
    playlistNameMaxLength, playlistNameMinLength,
    playlistDescMinLength, playlistDescMaxLength
} from '../../schemaConstants';

const visibilityEnum = z.enum(['private', 'public']);

export const createPlaylistSchema = z.object({
  name: z.string().min(playlistNameMinLength, {
    message: `Playlist name must be at least ${playlistNameMinLength} characters.`
  }).max(playlistNameMaxLength, {
    message: `Playlist name must not have more than ${playlistNameMaxLength} characters.`
  }),
  // Description is optional
  description: z.string().min(playlistDescMinLength, {
    message: `Playlist description must be at least ${playlistDescMinLength} characters.`
  }).max(playlistDescMaxLength, {
    message: `Playlist description must not have more than ${playlistDescMaxLength} characters.`
  }).optional(),
  visibility: visibilityEnum
}).refine((data) => data !== undefined, {
  message: 'Data not found or missing needed keys',
  path: [],
});

export type CreatePlaylist = z.infer<typeof createPlaylistSchema>;