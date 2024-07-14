import { QueryRunner } from 'typeorm';
import { rolesPermissions } from '../rolesPermissions';

export class CreateRoleDb {
  static async initRoles(queryRunner: QueryRunner): Promise<void> {
    for (const role in rolesPermissions) {
      const res = await queryRunner.query(
        'SELECT id FROM role WHERE name = ?',
        [role],
      );
      if (res.length === 0) {
        await queryRunner.query('INSERT INTO role (name) VALUES (?)', [role]);
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const role in rolesPermissions) {
      await queryRunner.query('DELETE FROM role WHERE name = ?', [role]);
    }
  }
}
