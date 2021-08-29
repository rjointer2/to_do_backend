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
            type: Schema.Types.Mixed,
            default: {},
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
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
    },
    { timestamps: true, minimize: false },
);


const Todo = model('Todo', todoSchema);

export default Todo;