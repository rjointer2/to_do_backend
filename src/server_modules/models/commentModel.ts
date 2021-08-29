
import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
    {
        createdBy: {
            type: String,
        },
        comment: {
            type: String,
        },
        todo: {
            type: String,
        },
        
    },
    { timestamps: true }
);


const Comment = model('Comment', commentSchema);

export default Comment;