import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import DBConflictError from "../errors/dbConflictError.js";

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
