const express = require("express");
const router = express.Router();
const controller = require("./controllers");

/**
 * @swagger
 * /api/recommendations/books:
 *   post:
 *     summary: Create a book recommendation
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               book_titles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of book titles (1-3) to base recommendations on
 *               exclude_same_author:
 *                 type: boolean
 *                 description: Whether to exclude books by the same author
 *     responses:
 *       201:
 *         description: Recommendation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 input_book_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error during recommendation creation
 */
router.post("/books", controller.createRecommendation);

/**
 * @swagger
 * /api/recommendations/genre:
 *   post:
 *     summary: Get recommendations by sub-genre
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user
 *               sub_genre:
 *                 type: string
 *                 description: Sub-genre to base recommendations on
 *     responses:
 *       201:
 *         description: Recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 input_sub_genre:
 *                   type: string
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error during recommendation retrieval
 */
router.post("/genre", controller.getRecommendationsBySubGenre);

/**
 * @swagger
 * /api/recommendations/{user_id}:
 *   get:
 *     summary: Get recommendations by user ID
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve recommendations for
 *     responses:
 *       200:
 *         description: List of recommendations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   input_book_ids:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   output_book_ids:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   books:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid user ID format
 *       404:
 *         description: No recommendations found for this user
 *       500:
 *         description: Server error during recommendation retrieval
 */
router.get("/:user_id", controller.getRecommendationsById);

/**
 * @swagger
 * /api/recommendations/{id}:
 *   delete:
 *     summary: Delete a recommendation
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recommendation to delete
 *     responses:
 *       200:
 *         description: Recommendation deleted successfully
 *       400:
 *         description: Invalid recommendation ID format
 *       404:
 *         description: Recommendation not found
 *       500:
 *         description: Server error during recommendation deletion
 */
router.delete("/:id", controller.deleteRecommendation);

module.exports = router;
