import { z } from 'zod';

export const setUserPermissionsSchema = z.object({
  userId: z.number({ message: 'User Id must be a number' }),
  permissions: z.number().array().min(1),
}).refine((data) => data !== undefined, {
  message: "Need user's and permission's list",
  path: [],
});

export type SetUserPermissions = z.infer<typeof setUserPermissionsSchema>;