import { MigrationInterface, QueryRunner } from 'typeorm';

export class mfaEnable1672409549095 implements MigrationInterface {
  name = 'mfaEnable1672409549095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "mfaEnabled" boolean`);
    await queryRunner.query(`UPDATE "user" SET "mfaEnabled" = false`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "mfaEnabled" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mfaEnabled"`);
  }
}
