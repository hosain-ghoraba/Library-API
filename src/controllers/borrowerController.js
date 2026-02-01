import * as borrowerService from "../services/borrowerService.js";

export async function registerBorrower(req, res) {
  const { name, email, password } = req.validated.body;
  const borrower = await borrowerService.createBorrower(name, email, password);
  res.status(201).json(borrower);
}
