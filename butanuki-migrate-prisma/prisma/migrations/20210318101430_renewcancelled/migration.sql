-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "previousOrderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("previousOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
