import * as borrowProcessService from "../services/borrowProcessService.js";

export async function borrowBook(req, res) {
  const { borrowerId, bookId } = req.validated.body;

  const borrowing = await borrowProcessService.borrowBook(
    Number(borrowerId),
    Number(bookId),
  );
  res.status(201).json(borrowing);
}

export async function returnBook(req, res) {
  const { borrowerId, bookId } = req.validated.body;

  const borrowing = await borrowProcessService.returnBook(
    Number(borrowerId),
    Number(bookId),
  );
  res.status(200).json(borrowing);
}

export async function listOverdueBooks(req, res) {
  const overdueBooks = await borrowProcessService.getOverdueBooks();
  res.status(200).json(overdueBooks);
}
