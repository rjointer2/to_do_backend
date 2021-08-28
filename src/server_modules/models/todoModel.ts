import { Schema, model } from 'mongoose';

const todoSchema = new Schema(
    {
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
            type: String,
            required: true,
        },
        dueDate: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.Mixed,
            ref: 'User'
        },
        comments: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


const Todo = model('Todo', todoSchema);

module.exports = Todo;