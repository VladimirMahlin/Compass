const Recommendation = require("../models/recommendationModels");
const axios = require("axios");
const { mySqlPromiseConfig } = require("../_config/mySqlConfig");
const { Types } = require("mongoose");

const RECOMMENDATION_SERVICE_URL =
  process.env.RECOMMENDATION_SERVICE_URL || "http://127.0.0.1:3002";

class RecommendationService {
  /**
   * Creates a new book recommendation based on provided book titles.
   * @param {number} userId - The ID of the user.
   * @param {string[]} bookTitles - Array of book titles for recommendation.
   * @param {boolean} excludeSameAuthor - Whether to exclude books by the same author.
   * @returns {object} - The recommendation data including input and recommended books.
   */
  async createRecommendation(userId, bookTitles, excludeSameAuthor) {
    const response = await axios.post(
      `${RECOMMENDATION_SERVICE_URL}/recommend-similar-books`,
      {
        book_titles: bookTitles,
        exclude_same_author: excludeSameAuthor,
      },
    );
    const recommendedBookIds = response.data;

    const query = "SELECT id FROM books WHERE title IN (?)";
    const [rows] = await mySqlPromiseConfig.query(query, [bookTitles]);
    const inputBookIds = rows.map((row) => row.id);

    const newRecommendation = new Recommendation({
      user_id: userId,
      input_book_ids: inputBookIds,
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

    return {
      user_id: userId,
      input_book_ids: inputBookIds,
      recommendations: recommendedBooks,
    };
  }

  /**
   * Retrieves book recommendations based on a specified sub-genre.
   * @param {number} userId - The ID of the user.
   * @param {string} subGenre - The sub-genre to get recommendations for.
   * @returns {object} - The recommendation data including input sub-genre and recommended books.
   */
  async getRecommendationsBySubGenre(userId, subGenre) {
    const response = await axios.post(
      `${RECOMMENDATION_SERVICE_URL}/recommend-books-by-sub-genre`,
      {
        sub_genre: subGenre,
      },
    );

    const recommendedBookIds = response.data;

    const newRecommendation = new Recommendation({
      user_id: userId,
      input_sub_genre: subGenre,
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

    return {
      user_id: userId,
      input_sub_genre: subGenre,
      recommendations: recommendedBooks,
    };
  }

  /**
   * Retrieves all recommendations for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Array} - List of recommendations with book details.
   */
  async getRecommendationsById(userId) {
    const recommendations = await Recommendation.find({
      user_id: userId,
    });

    if (recommendations.length === 0) {
      return null;
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

    return recommendationsWithDetails;
  }

  /**
   * Deletes a recommendation by its ID.
   * @param {string} id - The ID of the recommendation to delete.
   * @returns {object|null} - The deleted recommendation object, or null if not found.
   */
  async deleteRecommendation(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid recommendation ID format.");
    }
    const recommendation = await Recommendation.findByIdAndDelete(id);
    return recommendation;
  }
}

module.exports = new RecommendationService();
