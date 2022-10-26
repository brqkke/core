import { MigrationInterface, QueryRunner } from 'typeorm';

export class tokenHistory1666279781126 implements MigrationInterface {
  name = 'tokenHistory1666279781126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."token_history_creationcause_enum" AS ENUM('REFRESH', 'MANUAL_CHANGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "token_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "tokenId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creationCause" "public"."token_history_creationcause_enum" NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_93e5ed79dd74285796609162828" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "token_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."token_history_creationcause_enum"`,
    );
  }
}
