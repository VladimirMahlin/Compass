const express = require("express");
const router = express.Router();
const controller = require("./controllers");

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get books by IDs
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         description: Comma-separated list of book IDs
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid request, check your parameters.
 *       500:
 *         description: Server error while fetching books
 */
router.get("/", controller.getBooks);

/**
 * @swagger
 * /api/books/all:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error while fetching all books
 */
router.get("/all", controller.getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book with reviews
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book details with reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 userReview:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error while fetching book and reviews
 */
router.get("/:id", controller.getBookWithReviews);

/**
 * @swagger
 * /api/books/favorites/{userId}:
 *   get:
 *     summary: Get favorite books by user ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of favorite books for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: No favorites found for this user
 *       500:
 *         description: Server error while fetching user's favorite books
 */
router.get("/favorites/:userId", controller.getUserFavoriteBooks);

/**
 * @swagger
 * /api/books/favorites:
 *   post:
 *     summary: Add a book to favorites
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *                 description: ID of the book to add to favorites
 *               user_id:
 *                 type: string
 *                 description: ID of the user adding the book to favorites
 *     responses:
 *       200:
 *         description: Book added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error while adding book to favorites
 */
router.post("/favorites", controller.addFavorite);

/**
 * @swagger
 * /api/books/favorites:
 *   delete:
 *     summary: Remove a book from favorites
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *                 description: ID of the book to remove from favorites
 *               user_id:
 *                 type: string
 *                 description: ID of the user removing the book from favorites
 *     responses:
 *       200:
 *         description: Book removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error while removing book from favorites
 */
router.delete("/favorites", controller.removeFavorite);

/**
 * @swagger
 * /api/books/favorites/check:
 *   post:
 *     summary: Check if a book is in user's favorites
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *                 description: ID of the book to check
 *               user_id:
 *                 type: string
 *                 description: ID of the user
 *     responses:
 *       200:
 *         description: Check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       500:
 *         description: Server error while checking if book is in favorites
 */
router.post("/favorites/check", controller.checkFavorite);

module.exports = router;
