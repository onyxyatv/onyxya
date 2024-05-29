import { z } from 'zod';
import { usernameMaxLength, passwordMinLength, passwordMaxLength } from '@common/schemaConstants';

export const LoginSchema = z.object({
    username: z.string().min(4).max(usernameMaxLength),
    password: z.string().min(passwordMinLength).max(passwordMaxLength)
});

export type LoginSchemaDto = z.infer<typeof LoginSchema>;