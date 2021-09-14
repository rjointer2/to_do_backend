
// Modules
import Comment from "../models/commentModel";
import Todo from '../models/todoModel';

// Apollo 
import { ApolloError } from "apollo-server-express";

import { Auth, CommentObject, TodoObject, UserObject } from "../type";

//helpers


export async function addComment( _: never, args: CommentObject, context: Auth ) { 

    const { username, id }: UserObject =  context.verify();
    if( !id ) return null;

    try {
        const comment = await Comment.create({ createdBy: args.createdBy, comment: args.comment, todo: args.todoId }) as unknown as CommentObject
        // add dictionary to comment prop of the todo
        const todo = await Todo.findById(comment.todoId) as unknown as TodoObject // this is the todo id 
        // key -> comment _id and value user _id
        todo.comments[comment.id] = id;
        console.log(`${username} added a commented`);
        await todo.save()
        console.log(comment);
        return {
            _id: comment.id,
            createdBy: comment.createdBy,
            comment: comment.comment,
            todo: comment.todo
        }
    } catch(error) {
        console.log(error);
        throw new ApolloError('Cannot create comment')
    }

}

export async function deleteComment( _: never, args: CommentObject ) {
    // key -> comment _id and value user _id
    const comment = await Comment.findById(args.id);
    if(!comment) throw new ApolloError('Comment not found...')
    const todo = await Todo.findById(comment.todoId);
    if(!todo) throw new ApolloError('Todo not found...')
    // is in todo model find the comment prop and search for the 
    // comment id and delete the dictionary then the comment itself
    delete todo.comments[comment.id]
    console.log(comment.id)
    await todo.save();
    // now delete the Comment 
    await Comment.findByIdAndDelete(comment.id);
    return  {
        comment: 'this comment was deleted...'
    }

}