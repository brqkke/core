/*
  Warnings:

  - Made the column `accessToken` on table `Token` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `refreshToken` on table `Token` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "accessToken" SET NOT NULL,
ALTER COLUMN "refreshToken" SET NOT NULL;
