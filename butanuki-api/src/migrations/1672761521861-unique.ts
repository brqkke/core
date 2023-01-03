import { MigrationInterface, QueryRunner } from 'typeorm';

export class unique1672761521861 implements MigrationInterface {
  name = 'unique1672761521861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_template_frequency_enum" RENAME TO "order_template_frequency_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_template_frequency_enum" AS ENUM('UNIQUE', 'WEEKLY', 'MONTHLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_template" ALTER COLUMN "frequency" TYPE "public"."order_template_frequency_enum" USING "frequency"::"text"::"public"."order_template_frequency_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_template_frequency_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_template_frequency_enum_old" AS ENUM('WEEKLY', 'MONTHLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_template" ALTER COLUMN "frequency" TYPE "public"."order_template_frequency_enum_old" USING "frequency"::"text"::"public"."order_template_frequency_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."order_template_frequency_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_template_frequency_enum_old" RENAME TO "order_template_frequency_enum"`,
    );
  }
}
