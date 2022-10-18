import { MigrationInterface, QueryRunner } from 'typeorm';

export class vaultTpl1665840519651 implements MigrationInterface {
  name = 'vaultTpl1665840519651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vault_currency_enum" AS ENUM('CHF', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vault" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "currency" "public"."vault_currency_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_dd0898234c77f9d97585171ac59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81292a3b7eb9e7757a2202b522" ON "vault" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "vaultId" uuid NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_5b8244719f7c02c904f3e674be0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4778e619a5513127ea86754e9a" ON "order_template" ("vaultId") `,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "orderTemplateId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7a3fa334aff0c65ea65e51fde" ON "order" ("orderTemplateId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_a7a3fa334aff0c65ea65e51fde3" FOREIGN KEY ("orderTemplateId") REFERENCES "order_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault" ADD CONSTRAINT "FK_81292a3b7eb9e7757a2202b5220" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_template" ADD CONSTRAINT "FK_4778e619a5513127ea86754e9a7" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_template" DROP CONSTRAINT "FK_4778e619a5513127ea86754e9a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault" DROP CONSTRAINT "FK_81292a3b7eb9e7757a2202b5220"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_a7a3fa334aff0c65ea65e51fde3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7a3fa334aff0c65ea65e51fde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "orderTemplateId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4778e619a5513127ea86754e9a"`,
    );
    await queryRunner.query(`DROP TABLE "order_template"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_81292a3b7eb9e7757a2202b522"`,
    );
    await queryRunner.query(`DROP TABLE "vault"`);
    await queryRunner.query(`DROP TYPE "public"."vault_currency_enum"`);
  }
}
