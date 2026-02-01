import "dotenv/config";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import prisma from "../src/config/db.js";

const SALT_ROUNDS = 10;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(fromYearsAgo, toYearsAgo = 0) {
  const from = new Date();
  from.setFullYear(from.getFullYear() - fromYearsAgo);
  const to = new Date();
  to.setFullYear(to.getFullYear() - toYearsAgo);
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

async function main() {
  const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

  // Clear existing data (order matters: borrowings first due to FK)
  await prisma.borrowing.deleteMany();
  await prisma.book.deleteMany();
  await prisma.borrower.deleteMany();

  // --- Books: 300 ---
  const bookData = [];

  for (let i = 0; i < 300; i++) {
    const n = 100000 + i;
    const isbn = `978-0-00-${String(n).padStart(6, "0")}-${n % 10}`;
    const row = Math.floor(i / 20) + 1;
    const col = (i % 20) + 1;
    const shelfLocation = `R${row}-C${col}`;

    const baseQuantity = randomInt(2, 8);
    bookData.push({
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      isbn,
      baseQuantity,
      availableQuantity: baseQuantity,
      shelfLocation,
    });
  }

  await prisma.book.createMany({ data: bookData, skipDuplicates: true });
  const books = await prisma.book.findMany({ select: { id: true, baseQuantity: true } });
  const bookIds = books.map((b) => b.id);
  const availableByBookId = new Map(books.map((b) => [b.id, b.baseQuantity]));

  // --- Borrowers: 50 ---
  const uniqueEmails = faker.helpers.uniqueArray(
    () => faker.internet.email({ allowSpecialCharacters: false }),
    50,
  );
  const borrowerData = uniqueEmails.map((email) => ({
    name: faker.person.fullName(),
    email,
    hashedPassword,
  }));

  await prisma.borrower.createMany({ data: borrowerData, skipDuplicates: true });
  const borrowers = await prisma.borrower.findMany({ select: { id: true } });
  const borrowerIds = borrowers.map((b) => b.id);

  // --- Borrowings: 1000 (some returned, some not) ---
  const numNotReturned = 400;
  const numReturned = 600;

  const borrowingsToCreate = [];
  const activeBorrowingPairs = new Set(); // (borrowerId, bookId) for not-returned (unique per DB constraint)

  for (let i = 0; i < numNotReturned; i++) {
    const availableBookIds = bookIds.filter((id) => (availableByBookId.get(id) ?? 0) > 0);
    if (availableBookIds.length === 0) break;

    let bookId, borrowerId, pairKey;
    let attempts = 0;
    do {
      bookId = pick(availableBookIds);
      borrowerId = pick(borrowerIds);
      pairKey = `${borrowerId}-${bookId}`;
      attempts++;
      if (attempts > 5000) throw new Error("Could not find unique (borrower, book) pair for non-returned borrowing");
    } while (activeBorrowingPairs.has(pairKey));
    activeBorrowingPairs.add(pairKey);

    availableByBookId.set(bookId, availableByBookId.get(bookId) - 1);

    const borrowedAt = randomDate(2, 0);
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + 14);

    borrowingsToCreate.push({
      borrowerId,
      bookId,
      borrowedAt,
      dueDate,
      returnedAt: null,
    });
  }

  for (let i = 0; i < numReturned; i++) {
    const bookId = pick(bookIds);
    const borrowerId = pick(borrowerIds);
    const borrowedAt = randomDate(2, 0);
    const dueDate = new Date(borrowedAt);
    dueDate.setDate(dueDate.getDate() + 14);
    const returnedAt = new Date(borrowedAt);
    returnedAt.setDate(returnedAt.getDate() + randomInt(1, 20));

    borrowingsToCreate.push({
      borrowerId,
      bookId,
      borrowedAt,
      dueDate,
      returnedAt,
    });
  }

  await prisma.borrowing.createMany({
    data: borrowingsToCreate.map(({ returnedAt, ...rest }) => ({ ...rest, returnedAt })),
  });

  // Sync book availableQuantity for non-returned borrowings
  for (const b of books) {
    const available = availableByBookId.get(b.id) ?? b.baseQuantity;
    if (available !== b.baseQuantity) {
      await prisma.book.update({
        where: { id: b.id },
        data: { availableQuantity: available },
      });
    }
  }

  const notReturnedCount = borrowingsToCreate.filter((b) => b.returnedAt === null).length;
  const returnedCount = borrowingsToCreate.length - notReturnedCount;

  console.log("Seed completed:", {
    books: 300,
    borrowers: 50,
    borrowings: 1000,
    returned: returnedCount,
    notReturned: notReturnedCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
