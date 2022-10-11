-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'TO_DISABLE', 'DISABLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userStatus" "UserStatus" NOT NULL DEFAULT E'ACTIVE';
