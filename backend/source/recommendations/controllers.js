const Recommendation = require("./models");
const axios = require("axios");
const { mySqlPromiseConfig } = require("../../_config/mySqlConfig");
const { Types } = require("mongoose");

const RECOMMENDATION_SERVICE_URL = "http://localhost:3002";

exports.createRecommendation = async (req, res) => {
  const { user_id, book_titles, exclude_same_author } = req.body;

  if (
    !Array.isArray(book_titles) ||
    book_titles.length < 1 ||
    book_titles.length > 3
  ) {
    return res
      .status(400)
      .json({ message: "1 to 3 book titles are required." });
  }

  try {
    const response = await axios.post(
      `${RECOMMENDATION_SERVICE_URL}/recommend-similar-books`,
      {
        book_titles,
        exclude_same_author,
      },
    );

    const recommendedBookIds = response.data;

    const query = "SELECT id FROM books WHERE title IN (?)";
    const [rows] = await mySqlPromiseConfig.query(query, [book_titles]);
    const inputBookIds = rows.map((row) => row.id);

    const newRecommendation = new Recommendation({
      user_id,
      input_book_ids: inputBookIds,
      output_book_ids: recommendedBookIds,
      created_at: new Date(),
    });

    await newRecommendation.save();

    // Fetch details for recommended books
    const recommendedBooksQuery =
      "SELECT id, title, author, average_rating, rating_count FROM books WHERE id IN (?)";
    const [recommendedBooks] = await mySqlPromiseConfig.query(
      recommendedBooksQuery,
      [recommendedBookIds],
    );

    res.status(201).json({
      user_id,
      input_book_ids: inputBookIds,
      recommendations: recommendedBooks,
    });
  } catch (error) {
    console.error("Error in createRecommendation:", error);
    res.status(500).json({
      message: "Error in recommendation process",
      error: error.toString(),
    });
  }
};

exports.getRecommendationsBySubGenre = async (req, res) => {
  const { user_id, sub_genre } = req.body;

  if (!sub_genre) {
    return res.status(400).json({ message: "Sub-genre is required." });
  }

  try {
    const response = await axios.post(
      `${RECOMMENDATION_SERVICE_URL}/recommend-books-by-sub-genre`,
      {
        sub_genre,
      },
    );

    const recommendedBookIds = response.data;

    const newRecommendation = new Recommendation({
      user_id,
      input_sub_genre: sub_genre,
      output_book_ids: recommendedBookIds,
      created_at: new Date(),
    });

    await newRecommendation.save();

    const recommendedBooksQuery =
      "SELECT id, title, author, average_rating, rating_count FROM books WHERE id IN (?)";
    const [recommendedBooks] = await mySqlPromiseConfig.query(
      recommendedBooksQuery,
      [recommendedBookIds],
    );

    res.status(201).json({
      user_id,
      input_sub_genre: sub_genre,
      recommendations: recommendedBooks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sub-genre recommendations",
      error: error.toString(),
    });
  }
};

exports.getRecommendationsById = async (req, res) => {
  const { user_id } = req.params;

  if (isNaN(user_id)) {
    return res
      .status(400)
      .json({ message: "Invalid user_id format. Must be an integer." });
  }

  try {
    const recommendations = await Recommendation.find({
      user_id: parseInt(user_id, 10),
    });

    if (recommendations.length === 0) {
      return res
        .status(404)
        .json({ message: "No recommendations found for this user." });
    }

    const bookIds = recommendations.flatMap((rec) => rec.output_book_ids);

    const [books] = await mySqlPromiseConfig.query(
      "SELECT id, title, cover_link FROM books WHERE id IN (?)",
      [bookIds],
    );

    const recommendationsWithDetails = recommendations.map((rec) => ({
      ...rec.toObject(),
      books: books.filter((book) => rec.output_book_ids.includes(book.id)),
    }));

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
};

exports.deleteRecommendation = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid recommendation ID format." });
  }

  try {
    const recommendation = await Recommendation.findByIdAndDelete(id);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found." });
    }

    res.status(200).json({ message: "Recommendation deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recommendation", error });
  }
};
