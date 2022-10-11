-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "taskName" TEXT NOT NULL,
    "lastRun" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
