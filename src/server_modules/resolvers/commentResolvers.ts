
// Modules
import Comment from "../models/commentModel";
import Todo, { TodoSchemaInterface } from '../models/todoModel';

// Apollo 
import { ApolloError } from "apollo-server-express";

import { Auth, UserPayload } from "../type";

//helpers


export async function addComment( _: never, args: TodoSchemaInterface, context: Auth ) { 

    const { id, username } =  context.verify();

    const comment = await Comment.create({ 
        createdBy: args.createdBy, 
        comment: args.comment, 
        todoId: args.todoId 
    });

    if(!comment) throw new ApolloError('can not make comment under todo');

    const todo = await Todo.findById(comment.todoId) // this is the todo id 
    if(!todo) throw new ApolloError('Can not find todo when creating comment')

    todo.comments[comment._id] = id;
    console.log(`${username} added a commented`);
    await todo.save()
    console.log(comment);
    return {
        id: comment.id,
        createdBy: comment.createdBy,
        comment: comment.comment,
        todo: comment.todoId
    }

}

export async function deleteComment( _: never, args: TodoSchemaInterface ) {
    // key -> comment _id and value user _id
    const comment = await Comment.findById(args.id);
    if(!comment) throw new ApolloError('Comment not found...')
    const todo = await Todo.findById(comment.todoId);
    if(!todo) throw new ApolloError('Todo not found...')
    // is in todo model find the comment prop and search for the 
    // comment id and delete the dictionary then the comment itself
    delete todo.comments[comment._id]
    console.log(comment.id)
    await todo.save();
    // now delete the Comment 
    await Comment.findByIdAndDelete(comment.id);
    return  {
        comment: 'this comment was deleted...'
    }

}