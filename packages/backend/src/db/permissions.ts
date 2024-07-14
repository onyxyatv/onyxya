export enum Permissions {
  ReadMedias = 'read_medias',
  EditMedia = 'edit_media',
  CreateUser = 'create_user',
  ReadPermissions = 'read_permissions',
  ReadRolePermissions = 'read_role_permissions',
  AdminUsers = 'admin_users',
  AdminRoles = 'admin_roles',
  AdminUserPermissions = 'admin_user_permissions',
  UploadMedia = 'upload_media',
  DeleteMedia = 'delete_media',
  CreatePlaylist = 'create_playlist',
  Owner = 'owner',
}

export const permissions = [
  {
    name: Permissions.ReadMedias,
    description: 'Play movies, series and music',
  },
  {
    name: Permissions.EditMedia,
    description: 'Modify the media information sheet',
  },
  {
    name: Permissions.CreateUser,
    description: 'Create a new user account',
  },
  {
    name: Permissions.ReadPermissions,
    description: 'List and read permissions',
  },
  {
    name: Permissions.ReadRolePermissions,
    description: 'List permissions of a role',
  },
  {
    name: Permissions.AdminUsers,
    description: 'Can administrate users (Modification / Deletion)',
  },
  {
    name: Permissions.AdminRoles,
    description: 'Can administrate roles and edit their permissions',
  },
  {
    name: Permissions.AdminUserPermissions,
    description: 'Can administrate roles and edit their permissions',
  },
  {
    name: Permissions.UploadMedia,
    description: 'Can upload a new media',
  },
  {
    name: Permissions.DeleteMedia,
    description: 'Can delete a media',
  },
  {
    name: Permissions.CreatePlaylist,
    description: 'Can create a playlist',
  },
  {
    name: Permissions.Owner,
    description: 'Is the owner of the application',
  },
];
