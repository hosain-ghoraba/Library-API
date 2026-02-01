import * as borrowProcessService from "../services/borrowProcessService.js";

export async function borrowBook(req, res) {
  const { borrowerId, bookId } = req.validated.body;

  const borrowing = await borrowProcessService.borrowBook(
    Number(borrowerId),
    Number(bookId),
  );
  res.status(201).json(borrowing);
}
