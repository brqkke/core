/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[name]` on the table `Task`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task.name_unique" ON "Task"("name");
