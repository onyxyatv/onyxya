export const permissions = [
  {
    name: 'read_medias',
    description: 'Play movies, series and music',
  },
  {
    name: 'edit_media',
    description: 'Modify the media information sheet',
  },
  {
    name: 'create_user',
    description: 'Create a new user account',
  },
];

export const rolesPermissions = {
  admin: ['read_medias', 'edit_media', 'create_user'],
  user: ['read_medias'],
};
