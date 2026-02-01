import * as borrowerService from "../services/borrowerService.js";

export async function registerBorrower(req, res) {
  const { name, email, password } = req.validated.body;
  const borrower = await borrowerService.createBorrower(name, email, password);
  res.status(201).json(borrower);
}

export async function updateBorrower(req, res) {
  const { id } = req.validated.params;
  const updates = req.validated.body;
  const borrower = await borrowerService.updateBorrower(Number(id), updates);
  res.status(200).json(borrower);
}
