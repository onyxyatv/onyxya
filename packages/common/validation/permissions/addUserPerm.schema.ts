import { z } from 'zod';

export const addUserPermSchema = z.object({
  userId: z.number({ message: 'User Id must be a number' }),
  permissionId: z.number({ message: 'Permission id must be a number' }),
}).refine((data) => data !== undefined, {
  message: "Need user's and permission's id",
  path: [],
});

export type AddUserPerm = z.infer<typeof addUserPermSchema>;