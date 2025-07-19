const recommendationService = require("../services/recommendationService");

exports.createRecommendation = async (req, res, next) => {
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
    const recommendationData = await recommendationService.createRecommendation(
      user_id,
      book_titles,
      exclude_same_author,
    );
    res.status(201).json(recommendationData);
  } catch (error) {
    console.error("Error in createRecommendation:", error);
    next(error);
  }
};

exports.getRecommendationsBySubGenre = async (req, res, next) => {
  const { user_id, sub_genre } = req.body;

  if (!sub_genre) {
    return res.status(400).json({ message: "Sub-genre is required." });
  }

  try {
    const recommendationData =
      await recommendationService.getRecommendationsBySubGenre(
        user_id,
        sub_genre,
      );
    res.status(201).json(recommendationData);
  } catch (error) {
    console.error("Error in getRecommendationsBySubGenre:", error);
    next(error);
  }
};

exports.getRecommendationsById = async (req, res, next) => {
  const { user_id } = req.params;

  const parsedUserId = parseInt(user_id, 10);

  if (isNaN(parsedUserId)) {
    return res
      .status(400)
      .json({ message: "Invalid user_id format. Must be an integer." });
  }

  try {
    const recommendationsWithDetails =
      await recommendationService.getRecommendationsById(parsedUserId);

    if (!recommendationsWithDetails) {
      return res
        .status(404)
        .json({ message: "No recommendations found for this user." });
    }

    res.status(200).json(recommendationsWithDetails);
  } catch (error) {
    console.error("Error in getRecommendationsById:", error);
    next(error);
  }
};

exports.deleteRecommendation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const recommendation = await recommendationService.deleteRecommendation(id);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found." });
    }

    res.status(200).json({ message: "Recommendation deleted." });
  } catch (error) {
    console.error("Error in deleteRecommendation:", error);
    if (error.message === "Invalid recommendation ID format.") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};
