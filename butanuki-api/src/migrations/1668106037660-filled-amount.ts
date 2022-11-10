import { MigrationInterface, QueryRunner } from 'typeorm';

export class filledAmount1668106037660 implements MigrationInterface {
  name = 'filledAmount1668106037660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "filledAmount" numeric(20,8)`,
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
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "filledAmount"`);
  }
}
