-- AlterEnum
ALTER TYPE "TokenStatus" ADD VALUE 'NEED_REFRESH_RETRY';

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "lastRefreshTriedAt" TIMESTAMP(3),
ADD COLUMN     "lastRefreshedAt" TIMESTAMP(3),
ADD COLUMN     "refreshTriesCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Order.remoteId_unique" RENAME TO "Order_remoteId_key";

-- RenameIndex
ALTER INDEX "Task.name_unique" RENAME TO "Task_name_key";

-- RenameIndex
ALTER INDEX "Token.userId_unique" RENAME TO "Token_userId_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
