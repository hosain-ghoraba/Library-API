-- DropIndex
DROP INDEX "BorrowingRecord_returnedAt_bookId_borrowerId_idx";

CREATE UNIQUE INDEX "unique_active_borrowing" 
ON "BorrowingRecord"("bookId", "borrowerId") 
WHERE "returnedAt" IS NULL;