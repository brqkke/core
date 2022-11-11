import { MigrationInterface, QueryRunner } from "typeorm";

export class rateConstraint1668174838204 implements MigrationInterface {
    name = 'rateConstraint1668174838204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "rate" ADD CONSTRAINT "UQ_09fec6577a75399e8e1dcfb49bb" UNIQUE ("currency")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rate" DROP CONSTRAINT "UQ_09fec6577a75399e8e1dcfb49bb"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`);
    }

}
