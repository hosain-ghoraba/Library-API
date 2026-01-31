import prisma from "../config/db.js";
import UniqueConstraintException from "../errors/uniqueConstraintError.js";

export async function createBook(
  title,
  author,
  isbn,
  baseQuantity,
  shelfLocation,
) {
  // ISBN uniqueness check
  const isbnCount = await prisma.book.count({ where: { isbn } });
  if (isbnCount > 0) {
    throw new UniqueConstraintException("A book with this ISBN already exists");
  }

  // Shelf location uniqueness check
  const shelfLocationCount = await prisma.book.count({
    where: { shelfLocation },
  });
  if (shelfLocationCount > 0) {
    throw new UniqueConstraintException(
      "A book already exists at this shelf location",
    );
  }

  return prisma.book.create({
    data: {
      title: title,
      author: author,
      isbn: isbn,
      baseQuantity: baseQuantity,
      availableQuantity: baseQuantity,
      shelfLocation: shelfLocation,
    },
  });
}
