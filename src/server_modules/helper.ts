
// models 
import Todo from '../server_modules/models/todoModel';
import User from '../server_modules/models/userModel';
import Comment from '../server_modules/models/commentModel';

import moment from 'moment';

import { CommentObject, TodoObject, UserObject } from './type';

export async function getUserById ( id: string ): Promise<UserObject> {
    const user = await User.findById(id) as UserObject;
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        todos: getTodosByUserId(user.id),
        comments: user.comments,
        friends: user.friends,
    }
}

export async function getTodosByUserId( createdBy: UserObject ): Promise<TodoObject[any]> {
    const todos = await Todo.find({ createdBy }) as unknown as Array<TodoObject>;
    return todos.map(todo => {
        return {
            completed: todo.completed,
            likedBy: getAllUsersThatLikedTodo.bind(todo.likedBy),
            id: todo.id,
            subject: todo.subject,
            todo: todo.todo,
            createdBy: getUserById.bind(todo.createdBy),
            dueDate: todo.dueDate
        }
    })
}

export async function getAllUsersThatLikedTodo( likers: UserObject ) {

    const keys = Object.keys(likers);
    const users = await User.find({ 'username': { $in: keys } }).sort({ createdAt: 'desc' }) as unknown as Array<UserObject>;
    
    return users.map(user => {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: getTodosByUserId.bind( user.id),
            comments: user.comments,
            friends: user.friends,
        }
    }) 
    
}

export async function getAllCommentsAssicotedWithTodoID( dictionary: CommentObject ) {

    const keys = Object.keys(dictionary);
    const comments = Comment.find({ "_id" : { $in: keys } }).sort({ createdAt: 'desc' }) as unknown as Array<CommentObject>;
    return comments.map(comment => {
        return {
            id: comment.id,
            createdBy: getUserById.bind( comment.createdBy),
            comment: comment.comment,
            todo: comment.todo,
            createdAt: moment(comment.createdAt).format("YYYY-MM-DD hh:mm:ss a")
        }
    })
}