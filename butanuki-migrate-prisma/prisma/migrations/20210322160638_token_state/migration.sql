-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('ACTIVE', 'BROKEN');

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "status" "TokenStatus" NOT NULL DEFAULT E'ACTIVE';
