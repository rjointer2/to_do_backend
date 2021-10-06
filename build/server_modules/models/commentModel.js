"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    createdBy: {
        type: String,
    },
    comment: {
        type: String,
    },
    todoID: {
        type: String,
    },
}, { timestamps: true });
const Comment = (0, mongoose_1.model)('Comment', commentSchema);
exports.default = Comment;
