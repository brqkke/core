import { MigrationInterface, QueryRunner } from 'typeorm';

export class createdAt1672997728780 implements MigrationInterface {
  name = 'createdAt1672997728780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e11e649824a45d8ed01d597fd9" ON "user" ("createdAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e11e649824a45d8ed01d597fd9"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
  }
}
