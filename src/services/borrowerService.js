import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import DBConflictError from "../errors/dbConflictError.js";
import EntityNotFoundError from "../errors/entityNotFoundError.js";

const SALT_ROUNDS = 10;

export async function createBorrower(name, email, password) {
  const existing = await prisma.borrower.findUnique({ where: { email } });
  if (existing) {
    throw new DBConflictError("A borrower with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const borrower = await prisma.borrower.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });
  return {
    id: borrower.id,
    name: borrower.name,
    email: borrower.email,
    registeredDate: borrower.registeredDate,
    updatedAt: borrower.updatedAt,
  };
}

export async function updateBorrower(id, updates) {
  const existing = await prisma.borrower.findUnique({ where: { id } });
  if (!existing) {
    throw new EntityNotFoundError(`Borrower with id ${id} not found`);
  }
  const data = { ...updates };
  if (updates.email !== undefined) {
    const newEmailExists = await prisma.borrower.findFirst({
      where: { email: updates.email, id: { not: id } },
    });
    if (newEmailExists) {
      throw new DBConflictError("A borrower with this email already exists");
    }
  }
  const borrower = await prisma.borrower.update({
    where: { id },
    data,
  });
  return {
    id: borrower.id,
    name: borrower.name,
    email: borrower.email,
    registeredDate: borrower.registeredDate,
    updatedAt: borrower.updatedAt,
  };
}
