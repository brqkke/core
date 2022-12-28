import { MigrationInterface, QueryRunner } from 'typeorm';

export class partnerFee1672244320996 implements MigrationInterface {
  name = 'partnerFee1672244320996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "customPartnerFee" real`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "customPartnerFee"`,
    );
  }
}
