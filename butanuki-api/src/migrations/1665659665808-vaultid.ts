import { MigrationInterface, QueryRunner } from "typeorm";

export class vaultid1665659665808 implements MigrationInterface {
    name = 'vaultid1665659665808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "vaultId" uuid`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT 0`);
        await queryRunner.query(`CREATE INDEX "IDX_d0807274bc1a8c49384eaa4331" ON "order" ("vaultId") `);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d0807274bc1a8c49384eaa4331a" FOREIGN KEY ("vaultId") REFERENCES "vault"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d0807274bc1a8c49384eaa4331a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0807274bc1a8c49384eaa4331"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "tempCodeExpireAt" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "refreshTriesCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "vaultId"`);
    }

}
