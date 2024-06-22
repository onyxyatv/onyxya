import { z } from 'zod';
import {
  usernameMaxLength, usernameMinLength,
  passwordMinLength, passwordMaxLength
} from '../../schemaConstants';

const rolesEnum = z.enum(['admin', 'user']);

export const editUserSchema = z.object({
  username: z.string().min(usernameMinLength, {
    message: `Username must be at least ${usernameMinLength} characters.`
  }).max(usernameMaxLength).optional(),
  password: z.string().min(passwordMinLength, {
    message: `Password must be at least ${passwordMinLength} characters.`
  }).max(passwordMaxLength).optional(),
  role: rolesEnum.optional(),
  isActive: z.union([
    z.string().transform((value) => value === 'true'), 
    z.boolean()
  ]).optional(),
}).refine((data) => data !== undefined, {
  message: 'At least one value must be modified',
});

export type EditUser = z.infer<typeof editUserSchema>;