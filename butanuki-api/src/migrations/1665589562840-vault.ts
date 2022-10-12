import { MigrationInterface, QueryRunner } from 'typeorm';

export class vault1665589562840 implements MigrationInterface {
  name = 'vault1665589562840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vault_currency_enum" AS ENUM('CHF', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vault" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "currency" "public"."vault_currency_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_dd0898234c77f9d97585171ac59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81292a3b7eb9e7757a2202b522" ON "vault" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "vault" ADD CONSTRAINT "FK_81292a3b7eb9e7757a2202b5220" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vault" DROP CONSTRAINT "FK_81292a3b7eb9e7757a2202b5220"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_81292a3b7eb9e7757a2202b522"`,
    );
    await queryRunner.query(`DROP TABLE "vault"`);
    await queryRunner.query(`DROP TYPE "public"."vault_currency_enum"`);
  }
}
