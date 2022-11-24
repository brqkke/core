import { MigrationInterface, QueryRunner } from 'typeorm';

export class historicRate1669305245217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "historical_rate"`);
    await queryRunner.query(
      `DELETE FROM task WHERE name IN ('FETCH_EARLY_HISTORICAL_RATES', 'FETCH_HISTORICAL_RATES')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
