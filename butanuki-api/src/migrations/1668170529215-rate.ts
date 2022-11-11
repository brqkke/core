import { MigrationInterface, QueryRunner } from 'typeorm';

export class rate1668170529215 implements MigrationInterface {
  name = 'rate1668170529215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rate_currency_enum" AS ENUM('CHF', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" "public"."rate_currency_enum" NOT NULL, "rate" double precision NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "rate"`);
    await queryRunner.query(`DROP TYPE "public"."rate_currency_enum"`);
  }
}
