import { MigrationInterface, QueryRunner } from 'typeorm';
import { permissions } from '../permissions';

export class CreatePermissions1718199314 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissions) {
      await queryRunner.query(
        'INSERT INTO permission (name, description) VALUES (?,?)',
        [permission.name, permission.description],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const permission of permissions) {
      await queryRunner.query(
        'DELETE FROM permission WHERE name = ?',
        [permission.name],
      );
    }
  }
}
