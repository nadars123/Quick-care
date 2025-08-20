const Comment = require('../models/commentModel');

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 */
const createComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            user_id: req.body._id,
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get all comments
 * @route   GET /api/comments
 */
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('user_id', 'name email');
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get comment by ID
 * @route   GET /api/comments/:id
 */
const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user_id', 'name email');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update comment
 * @route   PUT /api/comments/:id
 */
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Check if user owns the comment
        if (comment.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment
        if (comment.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.remove();
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
};