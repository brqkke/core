import { MigrationInterface, QueryRunner } from 'typeorm';

export class historicRate1669043490177 implements MigrationInterface {
  name = 'historicRate1669043490177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."historical_rate_currency_enum" AS ENUM('CHF', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "historical_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "currency" "public"."historical_rate_currency_enum" NOT NULL, "timestamp" TIMESTAMP NOT NULL, "rate" double precision NOT NULL, CONSTRAINT "PK_67e0244914f21bb9d3612acf67c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3fef0ea39e6012d6f27cf271d0" ON "historical_rate" ("currency", "timestamp") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3fef0ea39e6012d6f27cf271d0"`,
    );
    await queryRunner.query(`DROP TABLE "historical_rate"`);
    await queryRunner.query(
      `DROP TYPE "public"."historical_rate_currency_enum"`,
    );
  }
}
