import { z } from 'zod';

export const searchMediaNameSchema = z.object({
    search: z.string()
});

export type SearchMediaName = z.infer<typeof searchMediaNameSchema>;