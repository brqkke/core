import { MigrationInterface, QueryRunner } from 'typeorm';

export class check1672676327395 implements MigrationInterface {
  name = 'check1672676327395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "CHK_7a94fc47eb85cfd1b47ba90c5f" CHECK ("mfaEnabled" = false OR "mfaSecret" IS NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "CHK_7a94fc47eb85cfd1b47ba90c5f"`,
    );
  }
}
