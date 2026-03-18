const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: "Token is not valid" });
    }
};

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a post
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, author, role, tags } = req.body;
        const newPost = new Post({
            title,
            content,
            author,
            authorId: req.user.id,
            role,
            tags
        });
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a comment
router.post('/:postId/comment', auth, async (req, res) => {
    try {
        const { author, content } = req.body;
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({
            author,
            authorId: req.user.id,
            content
        });

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
