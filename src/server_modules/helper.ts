
// models 
import Todo, { TodoSchemaInterface } from '../server_modules/models/todoModel';
import Comment, { CommentSchemaInterface } from '../server_modules/models/commentModel';
import { ApolloError } from 'apollo-server-express'
import User, { UserSchemaDefinition } from './models/userModel';

import moment from 'moment';
import bcrypt from 'bcrypt';

export const getUserById = async ( id: string ): Promise<any> => {
    const user = await User.findById(id)
    if(!user) return null;
    return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: getTodosByUserId.bind(this, user.id),
            comments: user?.comments,
            picture: image(user.id)
    }
}


export const getTodosByUserId = async ( createdBy: string ): Promise<any> => {
    const todos = await Todo.find({createdBy}) as Array<TodoSchemaInterface> | null
    if(!todos) throw new ApolloError(`Can not find todos when queried by user's id or no user was logged in...`);
    return todos.map((todo) => {
        let liked: boolean = false;
        if(todo.likedBy[createdBy]) liked = true;
        return {
            didUserLike: liked,
            completed: todo.completed,
            likedBy: getAllUsersThatLikedTodo(todo.likedBy),
            id: todo.id,
            subject: todo.subject,
            todo: todo.todo,
            createdAt: moment(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            picture: image(todo.createdBy),
            createdBy: getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            comments: getAllCommentsAssicotedWithTodoID.bind(this, todo.comments)
        }
    })
}
export const getAllUsersThatLikedTodo = async ( likers: UserSchemaDefinition ) => {

    const keys = Object.keys(likers);
    if(keys.length === 0) return []
    console.log(keys)
    
    const users = await User.find({ '_id': { $in: keys } })
    console.log(users)

    if(!users) {
        console.log('No users found when querying users the liked todo')
        throw new ApolloError('No users found when querying users the liked todo')
    }

    return users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: getTodosByUserId.bind(this, user.id),
            picture: image(user.id)
        }
    }) 
    
}

export async function getAllCommentsAssicotedWithTodoID( dictionary: object ) {

    const keys = Object.keys(dictionary);
    if(keys.length === 0) return []
    console.log(keys);
    const comments = await Comment.find({ "id" : { $in: keys } }).sort({ createdAt: 'desc' }) as unknown as Array<CommentSchemaInterface>
    console.log(comments);
    return comments.map(comment => {
        return {
            id: comment.id,
            createdBy: getUserById(comment.createdBy),
            comment: comment.comment,
            todoID: comment.todoID,
            createdAt: moment(comment.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
        }
    })
}

export function isCorrectPassword({ attemptPassword, correctPassword } : { attemptPassword: string, correctPassword: string | undefined }) {
    if(!correctPassword) throw new ApolloError('No User Found with Credentials Entered');
    return bcrypt.compare(attemptPassword, correctPassword);
}

// endpoint for api
export const image = (id: string) => `https://res.cloudinary.com/roodystorage/todo_images/${id}`