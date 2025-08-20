const express = require('express');
const router = express.Router();
const {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
} = require('../controllers/commentController');

/**
 * @swagger
 * /api/v1/comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *               user_id:
 *                 type: string
 *                 description: The id of user
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authenticated
 */
router.post('/', createComment);

/**
 * @swagger
 * /api/v1/comment:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 *       400:
 *         description: Error occurred
 */
router.get('/', getComments);

/**
 * @swagger
 * /api/v1/comment/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment details
 *       404:
 *         description: Comment not found
 */
router.get('/:id', getCommentById);

/**
 * @swagger
 * /api/v1/comment/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 */
router.put('/:id', updateComment);

/**
 * @swagger
 * /api/v1/comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', deleteComment);

module.exports = router;