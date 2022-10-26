import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokenVersion1666259301977 implements MigrationInterface {
  name = 'tokenVersion1666259301977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "version" integer`);
    await queryRunner.query(`UPDATE "token" SET "version" = 0`);
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "version" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "version"`);
  }
}
