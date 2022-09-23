import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1663934145773 implements MigrationInterface {
  name = 'init1663934145773';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'TO_DISABLE', 'DISABLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "tempCode" character varying, "tempCodeExpireAt" integer NOT NULL DEFAULT 0, "status" "public"."user_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
  }
}
