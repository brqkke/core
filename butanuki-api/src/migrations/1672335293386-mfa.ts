import { MigrationInterface, QueryRunner } from 'typeorm';

export class mfa1672335293386 implements MigrationInterface {
  name = 'mfa1672335293386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mfaSecret" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mfaSecret"`);
  }
}
