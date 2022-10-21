import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokenHistoryIndex1666295053037 implements MigrationInterface {
  name = 'tokenHistoryIndex1666295053037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4055b02c978419b1c22989426" ON "token_history" ("tokenId", "createdAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4055b02c978419b1c22989426"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`,
    );
  }
}
