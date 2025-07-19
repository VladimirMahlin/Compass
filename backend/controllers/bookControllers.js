const bookService = require("../services/bookService");

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getUserFavoriteBooks = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const books = await bookService.getUserFavoriteBooks(userId);
    if (!books) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user." });
    }
    res.json(books);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getBookWithReviews = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const result = await bookService.getBookWithReviews(id, userId);
    if (!result) {
      return res.status(404).send("Book not found");
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ message: "Book IDs are required." });
  }

  try {
    const books = await bookService.getBooksByIds(ids);
    res.json(books);
  } catch (error) {
    console.error("Error fetching book details:", error);
    if (error.message === "Invalid book ID format in query.") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.addFavorite = async (req, res, next) => {
  const { book_id, user_id } = req.body;

  try {
    const favorite = await bookService.addFavorite(book_id, user_id);
    res.json(favorite);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  const { book_id, user_id } = req.body;

  try {
    const message = await bookService.removeFavorite(book_id, user_id);
    if (!message) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    res.json({ message: message });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.checkFavorite = async (req, res, next) => {
  const { book_id, user_id } = req.body;

  try {
    const isFavorite = await bookService.checkFavorite(book_id, user_id);
    res.json({ isFavorite: isFavorite });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
