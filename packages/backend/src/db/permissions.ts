export enum Permissions {
  ReadMedias = 'read_medias',
  EditMedia = 'edit_media',
  CreateUser = 'create_user',
  ReadPermissions = 'read_permissions',
  ReadRolePermissions = 'read_role_permissions',
  AdminUsers = 'admin_users',
  AdminRoles = 'admin_roles',
  AdminUserPermissions = 'admin_user_permissions',
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
];

export const rolesPermissions = {
  admin: [
    Permissions.ReadMedias,
    Permissions.EditMedia,
    Permissions.CreateUser,
    Permissions.ReadPermissions,
    Permissions.ReadRolePermissions,
    Permissions.AdminUsers,
    Permissions.AdminRoles,
    Permissions.AdminUserPermissions,
  ],
  user: [Permissions.ReadMedias],
};
