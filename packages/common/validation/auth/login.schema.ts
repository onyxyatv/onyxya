import { z } from 'zod';
import { usernameMaxLength, passwordMinLength, passwordMaxLength, usernameMinLength } from '../../schemaConstants';

export const loginSchema = z.object({
    username: z.string().min(usernameMinLength, {
        message: `Username must be at least ${usernameMinLength} characters.`
    }).max(usernameMaxLength),
    password: z.string().min(passwordMinLength, {
        message: `Password must be at least ${passwordMinLength} characters.`
    }).max(passwordMaxLength)
});

export type LoginUser = z.infer<typeof loginSchema>;