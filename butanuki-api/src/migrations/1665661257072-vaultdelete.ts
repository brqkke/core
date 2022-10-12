import { MigrationInterface, QueryRunner } from "typeorm";

export class vaultdelete1665661257072 implements MigrationInterface {
    name = 'vaultdelete1665661257072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vault" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "vault" DROP COLUMN "deletedAt"`);
    }

}
