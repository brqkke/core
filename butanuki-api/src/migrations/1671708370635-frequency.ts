import { MigrationInterface, QueryRunner } from 'typeorm';

export class frequency1671708370635 implements MigrationInterface {
  name = 'frequency1671708370635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_template_frequency_enum" AS ENUM('WEEKLY', 'MONTHLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_template" ADD "frequency" "public"."order_template_frequency_enum" NOT NULL DEFAULT 'WEEKLY'`,
    );
    // drop default
    await queryRunner.query(
      `ALTER TABLE "order_template" ALTER COLUMN "frequency" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_template" DROP COLUMN "frequency"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_template_frequency_enum"`,
    );
  }
}
