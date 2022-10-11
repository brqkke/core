/*
  Warnings:

  - You are about to drop the column `taskName` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `lastRun` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastRunAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "taskName",
DROP COLUMN "lastRun",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "lastRunAt" TIMESTAMP(3) NOT NULL;
