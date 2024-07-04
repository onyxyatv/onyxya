import { sha512 } from 'js-sha512';
import UtilService from 'src/services/util.service';
import { QueryRunner } from 'typeorm';

export class CreateOwner {
  static cleanEnvStr(str: string): string {
    str = str.replaceAll("'", '');
    str = str.replaceAll(' ', '');
    return str;
  }

  static async create(queryRunner: QueryRunner): Promise<void> {
    const envOwnerName = process.env.ONYXYA_OWNER_USERNAME;
    const envOwnerPassword = process.env.ONYXYA_OWNER_PASSWORD;

    if (!envOwnerName || !envOwnerPassword) {
      throw new Error('Admin username or password is not defined!');
    }

    const username: string = this.cleanEnvStr(envOwnerName);
    const password: string = this.cleanEnvStr(envOwnerPassword);
    const salt: string = UtilService.generateSalt();
    const hashedPassword: string = sha512(salt + password + salt);

    await queryRunner.query(
      `INSERT INTO user (username, password, salt, roleId) VALUES (?,?,?,(SELECT id FROM role WHERE name = ?))`,
      [username, hashedPassword, salt, 'owner'],
    );
  }

  static async delete(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user WHERE username = ? AND roleId = (SELECT id FROM role WHERE name = 'owner')`,
      [process.env.ONYXYA_OWNER_USERNAME],
    );
  }
}
