/*
  Warnings:

  - Made the column `currency` on table `Order` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "currency" SET NOT NULL;
