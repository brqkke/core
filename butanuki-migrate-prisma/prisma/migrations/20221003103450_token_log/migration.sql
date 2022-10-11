-- CreateEnum
CREATE TYPE "TokenLogType" AS ENUM ('BROKEN_TOKEN');

-- CreateTable
CREATE TABLE "TokenLogs" (
    "id" SERIAL NOT NULL,
    "type" "TokenLogType" NOT NULL,
    "data" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenLogs_pkey" PRIMARY KEY ("id")
);
