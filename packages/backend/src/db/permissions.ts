export enum Permissions {
  ReadMedias = 'read_medias',
  EditMedia = 'edit_media',
  CreateUser = 'create_user',
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
];

export const rolesPermissions = {
  admin: [
    Permissions.ReadMedias,
    Permissions.EditMedia,
    Permissions.CreateUser,
  ],
  user: [Permissions.ReadMedias],
};
