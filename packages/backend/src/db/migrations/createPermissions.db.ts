import { QueryRunner } from 'typeorm';
import { permissions } from '../permissions';

export class CreatePermissionsDb {
  static async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissions) {
      await queryRunner.query(
        'INSERT INTO permission (name, description) VALUES (?,?)',
        [permission.name, permission.description],
      );
    }
  }

  static async down(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissions) {
      await queryRunner.query('DELETE FROM permission WHERE name = ?', [
        permission.name,
      ]);
    }
  }
}
