import { z } from 'zod';
import {
  usernameMaxLength, usernameMinLength,
  passwordMinLength, passwordMaxLength
} from '../../schemaConstants';

const rolesEnum = z.enum(['admin', 'user']);

export const createUserSchema = z.object({
  username: z.string().min(usernameMinLength, {
    message: `Username must be at least ${usernameMinLength} characters.`
  }).max(usernameMaxLength),
  password: z.string().min(passwordMinLength, {
    message: `Password must be at least ${passwordMinLength} characters.`
  }).max(passwordMaxLength),
  role: rolesEnum,
}).refine((data) => data.role !== undefined, {
  message: 'Role must be user or admin',
  path: ['role'],
});

export type CreateUser = z.infer<typeof createUserSchema>;