import { MigrationInterface, QueryRunner } from 'typeorm';

export class retry1664532076837 implements MigrationInterface {
  name = 'retry1664532076837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" ADD "lastRefreshedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD "lastRefreshTriedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD "refreshTriesCount" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."token_status_enum" RENAME TO "token_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_status_enum" AS ENUM('ACTIVE', 'NEED_REFRESH_RETRY', 'BROKEN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" TYPE "public"."token_status_enum" USING "status"::"text"::"public"."token_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."token_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_status_enum_old" AS ENUM('ACTIVE', 'BROKEN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" TYPE "public"."token_status_enum_old" USING "status"::"text"::"public"."token_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(`DROP TYPE "public"."token_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."token_status_enum_old" RENAME TO "token_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP COLUMN "refreshTriesCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP COLUMN "lastRefreshTriedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP COLUMN "lastRefreshedAt"`,
    );
  }
}
