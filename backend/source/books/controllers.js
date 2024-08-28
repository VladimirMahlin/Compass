const { mySqlPromiseConfig } = require("../../_config/mySqlConfig");
const Favorite = require("./models");
const Post = require("../posts/models");

exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await mySqlPromiseConfig.query("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during books retrieval");
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during book retrieval");
  }
};

exports.getUserFavoriteBooks = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const favorites = await Favorite.find({ user_id: userId });
    if (favorites.length === 0) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user." });
    }
    const bookIds = favorites.map((fav) => fav.book_id);
    const [books] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id IN (?)",
      [bookIds],
    );
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBookWithReviews = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const [bookRows] = await mySqlPromiseConfig.query(
      "SELECT * FROM books WHERE id = ?",
      [id],
    );
    if (bookRows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = bookRows[0];

    const reviews = await Post.find({ book_id: id });

    const userReview = reviews.find((review) => review.user_id === userId);

    res.json({ book, reviews, userReview });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during book and reviews retrieval");
  }
};

exports.getBooks = async (req, res) => {
  const { ids } = req.query;
  const bookIds = ids.split(",").map((id) => parseInt(id, 10));

  try {
    const [books] = await mySqlPromiseConfig.query(
      "SELECT id, title, cover_link FROM books WHERE id IN (?)",
      [bookIds],
    );
    res.json(books);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Error fetching book details", error });
  }
};

exports.addFavorite = async (req, res) => {
  const { book_id, user_id } = req.body;

  try {
    const favorite = new Favorite({ book_id, user_id });
    await favorite.save();
    res.json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { book_id, user_id } = req.body;

  try {
    const favorite = await Favorite.findOne({ book_id, user_id });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    await Favorite.deleteOne({ book_id, user_id });
    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  const { book_id, user_id } = req.body;

  try {
    const favorite = await Favorite.findOne({ book_id, user_id });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
