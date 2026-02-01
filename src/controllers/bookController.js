import * as bookService from "../services/bookService.js";

export async function getBooks(req, res) {
  const { title, author, isbn } = req.validated.query;
  const books = await bookService.getBooks({ title, author, isbn });
  res.status(200).json(books);
}

export async function addBook(req, res) {
  const { title, author, isbn, baseQuantity, shelfLocation } = req.validated.body;

  const newBook = await bookService.createBook(
    title,
    author,
    isbn,
    baseQuantity,
    shelfLocation,
  );
  res.status(201).json(newBook);
}

export async function updateBook(req, res) {
  const { id } = req.validated.params;
  const updates = req.validated.body;

  const updatedBook = await bookService.updateBook(Number(id), updates);
  res.status(200).json(updatedBook);
}

export async function deleteBook(req, res) {
  const { id } = req.validated.params;
  await bookService.deleteBook(Number(id));
  res.status(204).send();
}
