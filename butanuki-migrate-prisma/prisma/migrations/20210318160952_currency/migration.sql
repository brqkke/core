/*
  Warnings:

  - Made the column `amount` on table `Order` required. The migration will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('CHF', 'EUR');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currency" "Currency",
ALTER COLUMN "amount" SET NOT NULL;
