import { Schema, model } from 'mongoose';

export interface TodoSchemaInterface {
    [index: string]: any
    completed: boolean
    subject: string
    todo: string
    likedBy: any
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
            type: String,
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