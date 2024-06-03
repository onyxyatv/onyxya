import { z } from 'zod';
import { usernameMaxLength, passwordMinLength, passwordMaxLength } from '../../schemaConstants';

const rolesEnum = z.enum(['admin', 'user']);

export const createUserSchema = z.object({
    username: z.string().min(4).max(usernameMaxLength),
    password: z.string().min(passwordMinLength).max(passwordMaxLength),
    role: rolesEnum
});

export type CreateUser = z.infer<typeof createUserSchema>;