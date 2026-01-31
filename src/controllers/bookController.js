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
  res.status(201).json({ message: "Book added successfully", data: newBook });
}
