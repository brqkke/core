import { MigrationInterface, QueryRunner } from 'typeorm';

export class tries1675678100471 implements MigrationInterface {
  name = 'tries1675678100471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" ADD "triesCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "triesCount"`);
  }
}
