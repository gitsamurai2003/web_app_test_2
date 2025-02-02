/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cedula` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cedula_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "cedula",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "salary";

-- CreateTable
CREATE TABLE "UserInput" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cedula" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "salary" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInput_cedula_key" ON "UserInput"("cedula");

-- AddForeignKey
ALTER TABLE "UserInput" ADD CONSTRAINT "UserInput_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
