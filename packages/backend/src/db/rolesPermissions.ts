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
    Permissions.DeletePlaylist,
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
    Permissions.DeletePlaylist,
  ],
  user: [Permissions.ReadMedias, Permissions.CreatePlaylist],
};
