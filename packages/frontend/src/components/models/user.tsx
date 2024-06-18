export type User = {
  id: number
  username: string
  role: string
  isActive: true | false
};

export type UserPermission = {
  name: string
  id: number
  userId: number
};