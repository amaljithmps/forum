const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
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
    }
},{
    timestamps: true
});

const forumSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    message: {
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