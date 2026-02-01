import * as bookService from "../services/bookService.js";

export async function addBook(req, res) {
  const { title, author, isbn, baseQuantity, shelfLocation } = req.body;

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
  const { id } = req.params;
  const updates = req.body;

  const updatedBook = await bookService.updateBook(Number(id), updates);
  res.status(200).json(updatedBook);
}
