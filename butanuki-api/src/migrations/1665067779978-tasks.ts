import { MigrationInterface, QueryRunner } from 'typeorm';

export class tasks1665067779978 implements MigrationInterface {
  name = 'tasks1665067779978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_log_type_enum" AS ENUM('BROKEN_TOKEN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."event_log_type_enum" NOT NULL, "data" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_d8ccd9b5b44828ea378dd37e691" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastRunAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_20f1f21d6853d9d20d501636ebd" UNIQUE ("name"), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "event_log"`);
    await queryRunner.query(`DROP TYPE "public"."event_log_type_enum"`);
  }
}
