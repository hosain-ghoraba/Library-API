DROP INDEX IF EXISTS "unique_active_borrowing";

-- we want to swap order of (bookId, borrowerId) to (borrowerId, bookId) 
-- to make quering by (borrowerId) where returnedAt is null able to use this index
CREATE UNIQUE INDEX "unique_active_borrowing" 
ON "BorrowingRecord"("borrowerId", "bookId") 
WHERE "returnedAt" IS NULL;