
// models 
import Todo, { TodoSchemaInterface } from '../server_modules/models/todoModel';
import Comment, { CommentSchemaInterface } from '../server_modules/models/commentModel';
import { ApolloError } from 'apollo-server-express'
import User, { UserSchemaDefinition } from './models/userModel';

import moment from 'moment';
import bcrypt from 'bcrypt';

export async function getUserById( id: string ): Promise<any> {
    const user = await User.findById(id);
    if(!user) throw new ApolloError('Can not find user')
    console.log(user.id)
    return {
        id: user.id.toString()
    }
}

export async function getTodosByUserId( createdBy: string ): Promise<any> {
    const todos = await Todo.find({ "id": createdBy}) as Array<TodoSchemaInterface> | null
    if(!todos) throw new ApolloError(`Can not find todos when queried by user's id or no user was logged in...`);
    return todos.map(todo => {
        return {
            completed: todo.completed,
            likedBy: getAllUsersThatLikedTodo.bind(todo.likedBy),
            id: todo.id.toString(),
            subject: todo.subject,
            todo: todo.todo,
            createdBy: getUserById(todo.createdBy.toString()),
            dueDate: todo.dueDate
        }
    })
}

export async function getAllUsersThatLikedTodo( likers: UserSchemaDefinition ) {

    const keys = Object.keys(likers);
    const users = await User.find({ 'username': { $in: keys } }).sort({ createdAt: 'desc' })
    return users.map(user => {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: getTodosByUserId.bind(user.id),
            comments: user.comments,
            friends: user.friends,
        }
    }) 
    
}

export async function getAllCommentsAssicotedWithTodoID( dictionary: object ) {

    const keys = Object.keys(dictionary);
    const comments = Comment.find({ "_id" : { $in: keys } }).sort({ createdAt: 'desc' }) as unknown as Array<CommentSchemaInterface>
    return comments.map(comment => {
        return {
            id: comment.id,
            createdBy: getUserById.bind( comment.createdBy),
            comment: comment.comment,
            todoId: comment.todoId,
            createdAt: moment(comment.createdAt).format("YYYY-MM-DD hh:mm:ss a")
        }
    })
}

export function isCorrectPassword({ password, correctPassword } : { password: string, correctPassword: string | undefined }) {
    if(!correctPassword) throw new ApolloError('No User Found with Credentials Entered');
    return bcrypt.compare(password, correctPassword);
}