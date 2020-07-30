const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentMessage: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const forumSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    community: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0,
        min: 0
    },
    downvotes: {
        type: Number,
        default: 0,
        min: 0
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);