import { MigrationInterface, QueryRunner } from 'typeorm';

export class cause1666354733809 implements MigrationInterface {
  name = 'cause1666354733809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."token_history_creationcause_enum" RENAME TO "token_history_creationcause_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_history_creationcause_enum" AS ENUM('REFRESH', 'REFRESH_FROM_HISTORY', 'MANUAL_CHANGE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token_history" ALTER COLUMN "creationCause" TYPE "public"."token_history_creationcause_enum" USING "creationCause"::"text"::"public"."token_history_creationcause_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."token_history_creationcause_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."token_history_creationcause_enum_old" AS ENUM('REFRESH', 'MANUAL_CHANGE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token_history" ALTER COLUMN "creationCause" TYPE "public"."token_history_creationcause_enum_old" USING "creationCause"::"text"::"public"."token_history_creationcause_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."token_history_creationcause_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."token_history_creationcause_enum_old" RENAME TO "token_history_creationcause_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`,
    );
  }
}
