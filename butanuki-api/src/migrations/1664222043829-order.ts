import { MigrationInterface, QueryRunner } from 'typeorm';

export class order1664222043829 implements MigrationInterface {
  name = 'order1664222043829';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('TO_CANCEL', 'OPEN', 'FILLED', 'FILLED_NEED_RENEW', 'CANCELLED_NEED_RENEW', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_currency_enum" AS ENUM('CHF', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "remoteId" character varying NOT NULL, "transferLabel" character varying NOT NULL, "status" "public"."order_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "lastCheckedAt" TIMESTAMP NOT NULL, "previousOrderId" uuid, "amount" integer NOT NULL, "currency" "public"."order_currency_enum" NOT NULL, "bankDetails" character varying NOT NULL, "redactedCryptoAddress" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_e005f1c09ff0cc2e36430f84787" UNIQUE ("remoteId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_caabe91507b3379c7ba73637b8" ON "order" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e1ac9c252ed1e2f8ae7cc3ca75a" FOREIGN KEY ("previousOrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e1ac9c252ed1e2f8ae7cc3ca75a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_caabe91507b3379c7ba73637b8"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
  }
}
