import { QueryRunner } from 'typeorm';
import { rolesPermissions } from '../permissions';

export class CreateRolesPermissionsDb {
  static async up(queryRunner: QueryRunner): Promise<void> {
    this.down(queryRunner).then(async () => {
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

  static async down(queryRunner: QueryRunner): Promise<void> {
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
