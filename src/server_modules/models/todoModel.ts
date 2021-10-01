import { Schema, model } from 'mongoose';

export interface TodoSchemaInterface {
    [index: string]: any
    completed: boolean
    subject: string
    todo: string
    likeBy: boolean
    dueDate: string
    createdBy: string
    comments: {[index: string]: any}
    id: string
}

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


const Todo = model<TodoSchemaInterface>('Todo', todoSchema);

export default Todo;