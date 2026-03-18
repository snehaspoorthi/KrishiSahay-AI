const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Farmer' },
    tags: [String],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
