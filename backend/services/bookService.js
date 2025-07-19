const { mySqlPromiseConfig } = require("../_config/mySqlConfig");
const Favorite = require("../models/bookModels");
const Post = require("../models/postModels");

class BookService {
  /**
   * Retrieves all books from the database.
   * @returns {Array} An array of book objects.
   */
  async getAllBooks() {
    const [rows] = await mySqlPromiseConfig.query("SELECT * FROM books");
    return rows;
  }

  /**
   * Retrieves a single book by its ID.
   * @param {number} id - The ID of the book.
   * @returns {object|null} The book object, or null if not found.
   */
  async getBookById(id) {
    const [rows] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id = ?",
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Retrieves favorite books for a given user.
   * @param {number} userId - The ID of the user.
   * @returns {Array} An array of favorite book objects for the user.
   */
  async getUserFavoriteBooks(userId) {
    const favorites = await Favorite.find({ user_id: userId });
    if (favorites.length === 0) {
      return null; // No favorites found
    }
    const bookIds = favorites.map((fav) => fav.book_id);
    const [books] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id IN (?)",
      [bookIds],
    );
    return books;
  }

  /**
   * Retrieves a book along with its reviews and the current user's review.
   * @param {number} bookId - The ID of the book.
   * @param {number} userId - The ID of the current user.
   * @returns {object|null} An object containing book details, all reviews, and the user's review, or null if book not found.
   */
  async getBookWithReviews(bookId, userId) {
    const [bookRows] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id = ?",
      [bookId],
    );
    if (bookRows.length === 0) {
      return null;
    }
    const book = bookRows[0];

    const reviews = await Post.find({ book_id: bookId });
    const userReview = reviews.find((review) => review.user_id === userId);

    return { book, reviews, userReview };
  }

  /**
   * Retrieves books by a list of IDs.
   * @param {string} idsString - A comma-separated string of book IDs.
   * @returns {Array} An array of book objects with id, title, and cover_link.
   * @throws {Error} If there's an error fetching book details.
   */
  async getBooksByIds(idsString) {
    const bookIds = idsString.split(",").map((id) => parseInt(id, 10));
    if (bookIds.some(isNaN)) {
      throw new Error("Invalid book ID format in query.");
    }

    const [books] = await mySqlPromiseConfig.query(
      "SELECT id, title, cover_link FROM books WHERE id IN (?)",
      [bookIds],
    );
    return books;
  }

  /**
   * Adds a book to a user's favorites.
   * @param {number} book_id - The ID of the book to favorite.
   * @param {number} user_id - The ID of the user.
   * @returns {object} The newly created favorite object.
   */
  async addFavorite(book_id, user_id) {
    const favorite = new Favorite({ book_id, user_id });
    await favorite.save();
    return favorite;
  }

  /**
   * Removes a book from a user's favorites.
   * @param {number} book_id - The ID of the book to remove.
   * @param {number} user_id - The ID of the user.
   * @returns {string} Success message.
   * @throws {Error} If favorite not found.
   */
  async removeFavorite(book_id, user_id) {
    const favorite = await Favorite.findOne({ book_id, user_id });
    if (!favorite) {
      return null;
    }
    await Favorite.deleteOne({ book_id, user_id });
    return "Favorite removed successfully";
  }

  /**
   * Checks if a book is in a user's favorites.
   * @param {number} book_id - The ID of the book to check.
   * @param {number} user_id - The ID of the user.
   * @returns {boolean} True if the book is a favorite, false otherwise.
   */
  async checkFavorite(book_id, user_id) {
    const favorite = await Favorite.findOne({ book_id, user_id });
    return !!favorite;
  }
}

module.exports = new BookService();
