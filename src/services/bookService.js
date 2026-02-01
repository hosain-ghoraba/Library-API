import prisma from "../config/db.js";
import DBConflictError from "../errors/dbConflictError.js";
import EntityNotFoundError from "../errors/entityNotFoundError.js";

export async function createBook(
  title,
  author,
  isbn,
  baseQuantity,
  shelfLocation,
) {
  if (await prisma.book.findUnique({ where: { isbn } })) {
    throw new DBConflictError("A book with this ISBN already exists");
  }
  if (await prisma.book.findUnique({ where: { shelfLocation } })) {
    throw new DBConflictError("A book already exists at this shelf location");
  }
  return await prisma.book.create({
    data: {
      title,
      author,
      isbn,
      baseQuantity,
      availableQuantity: baseQuantity,
      shelfLocation,
    },
  });
}
export async function updateBook(id, updates) {
  const data = { ...updates };

  // ------------------ book existance check
  const existingBook = await prisma.book.findUnique({ where: { id } });
  if (!existingBook) {
    throw new EntityNotFoundError(`Book with id ${id} not found`);
  }
  // ------------------ quantiy logic check
  const baseQuantity = updates.baseQuantity;
  if (baseQuantity !== undefined) {
    const borrowedCount =
      existingBook.baseQuantity - existingBook.availableQuantity;

    if (baseQuantity < borrowedCount) {
      throw new DBConflictError(
        "Base quantity cannot be less than the number of copies currently borrowed",
      );
    }
    data.availableQuantity = updates.baseQuantity - borrowedCount;
  }
  // ------------------ ISBN uniqueness check
  const isbn = updates.isbn;
  if (isbn !== undefined) {
    if (await prisma.book.findUnique({ where: { isbn } })) {
      throw new DBConflictError("A book with this ISBN already exists");
    }
  }
  // ------------------ shelf location uniqueness check
  const shelfLocation = updates.shelfLocation;
  if (shelfLocation !== undefined) {
    if (await prisma.book.findUnique({ where: { shelfLocation } })) {
      throw new DBConflictError("A book already exists at this shelf location");
    }
  }
  return await prisma.book.update({
    where: { id },
    data,
  });
}
