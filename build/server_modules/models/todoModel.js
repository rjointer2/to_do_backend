"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const todoSchema = new mongoose_1.Schema({
    completed: {
        type: Boolean,
        default: false
    },
    subject: {
        type: String,
        required: true,
    },
    todo: {
        type: String,
        required: true,
    },
    likedBy: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    dueDate: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.Mixed,
        ref: 'User'
    },
    comments: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
        default: {}
    },
}, { timestamps: true, minimize: false });
const Todo = (0, mongoose_1.model)('Todo', todoSchema);
exports.default = Todo;
