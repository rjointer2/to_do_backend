
import { Schema, model } from 'mongoose';

interface CommentSchemaInterface extends Document {
    createdBy: string
    comment: string
    todoId: string
}

const commentSchema = new Schema(
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