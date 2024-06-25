import { QueryRunner } from 'typeorm';
import { rolesPermissions } from '../permissions';

export class CreateRolesPermissionsDb {
  static async up(queryRunner: QueryRunner): Promise<void> {
    this.deleteRolesPermissions(queryRunner).then(async () => {
      for (const role in rolesPermissions) {
        const permissions = rolesPermissions[role];
        for (const permission in permissions) {
          await queryRunner.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ((SELECT id FROM role WHERE name = ?), (SELECT id FROM permission WHERE name = ?))',
            [role, permissions[permission]],
          );
        }
      }
    });
  }

  static async addRolePermission(
    queryRunner: QueryRunner,
    roleName: string,
    permissionName: string,
  ): Promise<void> {
    await queryRunner.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ((SELECT id FROM role WHERE name = ?), (SELECT id FROM permission WHERE name = ?))',
      [roleName, permissionName],
    );
  }

  /**
   * This method removes permission's role from database
   * @param queryRunner | the queryRunner instance
   * @param roleName
   * @param permId | permission id (foreign key)
   */
  static async removeRolePermission(
    queryRunner: QueryRunner,
    roleName: string,
    permId: number,
  ) {
    await queryRunner.query(
      'DELETE FROM role_permissions WHERE role_id = (SELECT id FROM role WHERE name = ?)' +
        ' AND permission_id = ?',
      [roleName, permId],
    );
  }

  static async deleteRolesPermissions(queryRunner: QueryRunner): Promise<void> {
    for (const role in rolesPermissions) {
      const permissions = rolesPermissions[role];
      for (const permission in permissions) {
        await queryRunner.query('SELECT * FROM role');
        await queryRunner.query(
          'DELETE FROM role_permissions WHERE role_id = (SELECT id FROM role WHERE name = ?)' +
            ' AND permission_id = (SELECT id FROM permission WHERE name = ?)',
          [role, permission],
        );
      }
    }
  }
}
