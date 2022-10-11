/*
  Warnings:

  - The migration will remove the values [OPENED,CLOSED] on the enum `OrderStatus`. If these variants are still used in the database, the migration will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('TO_CANCEL', 'OPEN', 'FILLED', 'CANCELLED');
ALTER TABLE "public"."Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;
