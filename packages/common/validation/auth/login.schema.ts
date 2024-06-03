import { z } from 'zod';
import { usernameMaxLength, passwordMinLength, passwordMaxLength } from '../../schemaConstants';

export const loginSchema = z.object({
    username: z.string().min(4).max(usernameMaxLength),
    password: z.string().min(passwordMinLength).max(passwordMaxLength)
});

export type LoginUser = z.infer<typeof loginSchema>;