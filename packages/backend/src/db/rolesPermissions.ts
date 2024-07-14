import { Permissions } from './permissions';

export const rolesPermissions = {
  owner: [
    Permissions.ReadMedias,
    Permissions.EditMedia,
    Permissions.CreateUser,
    Permissions.ReadPermissions,
    Permissions.ReadRolePermissions,
    Permissions.AdminUsers,
    Permissions.AdminRoles,
    Permissions.AdminUserPermissions,
    Permissions.UploadMedia,
    Permissions.DeleteMedia,
    Permissions.CreatePlaylist,
  ],
  admin: [
    Permissions.ReadMedias,
    Permissions.EditMedia,
    Permissions.CreateUser,
    Permissions.ReadPermissions,
    Permissions.ReadRolePermissions,
    Permissions.AdminUsers,
    Permissions.AdminRoles,
    Permissions.AdminUserPermissions,
    Permissions.UploadMedia,
    Permissions.DeleteMedia,
    Permissions.CreatePlaylist,
  ],
  user: [Permissions.ReadMedias, Permissions.CreatePlaylist],
};
