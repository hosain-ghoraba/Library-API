import prisma from "../config/db.js";
import { LOAN_DAYS } from "../constants.js";
import DBConflictError from "../errors/dbConflictError.js";
import EntityNotFoundError from "../errors/entityNotFoundError.js";

export async function borrowBook(borrowerId, bookId) {
  // check borrower existence
  const borrower = await prisma.borrower.findUnique({
    where: { id: borrowerId },
  });
  if (!borrower) {
    throw new EntityNotFoundError(`Borrower with id ${borrowerId} not found`);
  }
  // check book existence
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });
  if (!book) {
    throw new EntityNotFoundError(`Book with id ${bookId} not found`);
  }
  // check book availability
  if (book.availableQuantity < 1) {
    throw new DBConflictError("No copies of this book available to borrow");
  }

  const borrowedAt = new Date();
  const dueDate = new Date(borrowedAt);
  dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

  return await prisma.$transaction(async (tx) => {
    const borrowing = await tx.borrowing.create({
      data: {
        borrowerId,
        bookId,
        // for bosta supervisor :
        // I am setting the borrowedAt manually here, to ensure that the
        // difference between borrowedAt and dueDate is EXACTLY (LOAN_DAYS)
        // depending on the db to set borrowedAt to db function now()
        // will make the difference between borrowedAt and dueDate
        // be (LOAN_DAYS - some milliseconds) (the difference between node.js now() and the DB now()
        // which is ok in my opinion,but lets pe picky this time :)
        borrowedAt,
        dueDate,
      },
    });

    await tx.book.update({
      where: { id: bookId },
      data: { availableQuantity: { decrement: 1 } },
    });

    return borrowing;
  });
}

export async function getBorrowingsByBorrowerId(borrowerId) {
  const borrower = await prisma.borrower.findUnique({
    where: { id: borrowerId },
  });
  if (!borrower) {
    throw new EntityNotFoundError(`Borrower with id ${borrowerId} not found`);
  }
  const borrowings = await prisma.borrowing.findMany({
    // this "where" will use the partial index
    where: {
      borrowerId,
      returnedAt: null,
    },
    select: {
      borrowedAt: true,
      dueDate: true,
      // eager loading to prevent N+1 queries
      book: { select: { title: true } },
    },
    orderBy: { borrowedAt: "asc" },
  });
  return borrowings.map((b) => ({
    bookName: b.book.title,
    borrowedAt: b.borrowedAt.toISOString(),
    dueDate: b.dueDate.toISOString(),
  }));
}

export async function returnBook(borrowerId, bookId) {
  const borrowing = await prisma.borrowing.findFirst({
    // this will use the parial index
    where: {
      borrowerId,
      bookId,
      returnedAt: null,
    },
  });
  if (!borrowing) {
    throw new EntityNotFoundError(
      `No (unreturned) borrowing found for borrower ${borrowerId} and book ${bookId}`,
    );
  }

  const returnedAt = new Date();

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.borrowing.update({
      where: { id: borrowing.id },
      data: { returnedAt },
    });

    await tx.book.update({
      where: { id: bookId },
      data: { availableQuantity: { increment: 1 } },
    });

    return updated;
  });
}
