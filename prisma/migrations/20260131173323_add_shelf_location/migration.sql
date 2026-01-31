/*
  Warnings:

  - You are about to drop the column `quantity` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Borrower` table. All the data in the column will be lost.
  - You are about to drop the `BorrowRecord` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shelfLocation]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableQuantity` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseQuantity` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BorrowRecord" DROP CONSTRAINT "BorrowRecord_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BorrowRecord" DROP CONSTRAINT "BorrowRecord_borrowerId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "quantity",
ADD COLUMN     "availableQuantity" INTEGER NOT NULL,
ADD COLUMN     "baseQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Borrower" DROP COLUMN "createdAt",
ADD COLUMN     "hashedPassword" TEXT NOT NULL;

-- DropTable
DROP TABLE "BorrowRecord";

-- CreateTable
CREATE TABLE "BorrowingRecord" (
    "id" SERIAL NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "BorrowingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BorrowingRecord_returnedAt_bookId_borrowerId_idx" ON "BorrowingRecord"("returnedAt", "bookId", "borrowerId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_shelfLocation_key" ON "Book"("shelfLocation");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_author_idx" ON "Book"("author");

-- AddForeignKey
ALTER TABLE "BorrowingRecord" ADD CONSTRAINT "BorrowingRecord_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowingRecord" ADD CONSTRAINT "BorrowingRecord_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
