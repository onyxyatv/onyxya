import { sha512 } from "js-sha512";
import UtilService from "../services/util.service";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdmin1717278035 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    if (!process.env.ONYXYA_ADMIN_USERNAME || !process.env.ONYXYA_ADMIN_PASSWORD) {
      throw new Error('Admin username or password is not defined!');
    }
    const username: string = process.env.ONYXYA_ADMIN_USERNAME;
    const password: string = process.env.ONYXYA_ADMIN_PASSWORD;
    const salt: string = UtilService.generateSalt();
    const hashedPassword: string = sha512(salt + password + salt);

    await queryRunner.query(
      `INSERT INTO user (username, password, salt, role) VALUES (?,?,?,?)`, 
      [username, hashedPassword, salt, 'admin'],
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user WHERE username = ? AND role = 'admin'`, [process.env.ONYXYA_ADMIN_USERNAME],
    )
  }
}