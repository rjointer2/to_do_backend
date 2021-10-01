
import { Schema, model, Document } from 'mongoose';

export interface CommentSchemaInterface extends Document {
    createdBy: string
    comment: { [index: string]: any }
    todoId: string
    createdAt?: string
    id?: string
}

const commentSchema = new Schema<CommentSchemaInterface>(
    {
        createdBy: {
            type: String,
        },
        comment: {
            type: String,
        },
        todoId: {
            type: String,
        },
        
    },
    { timestamps: true }
);


const Comment = model<CommentSchemaInterface>('Comment', commentSchema);

export default Comment;