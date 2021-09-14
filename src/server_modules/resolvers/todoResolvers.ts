
import { ApolloError } from 'apollo-server-express';

import { getAllCommentsAssicotedWithTodoID, getAllUsersThatLikedTodo, getUserById } from '../helper';
import Todo from '../models/todoModel';


import { Auth, UserPayload, TodoObject } from '../type';

export async function todos ( _: never, args: { offset: number, limit: number }, context: Auth ) {
    const { id } = context.verify() as UserPayload;
    try {
        const todos = await Todo.find().sort({ createdAt: 'desc' }) as unknown as Array<TodoObject>
        console.log(todos)
        return todos.slice(args.offset, args.limit).map(todo => {
            let liked: boolean = false;
            if(todo.likedBy[id]) liked = true;
            return {
                id: todo.id,
                likedBy: getAllUsersThatLikedTodo(todo.likedBy), 
                subject: todo.subject,
                completed: todo.completed,
                todo: todo.todo,
                createdBy: getUserById(todo.createdBy),
                dueDate: todo.dueDate,
                didUserLike: liked,
                comment: getAllCommentsAssicotedWithTodoID(todo.comments) // no done yet
            }
        })
    } catch(error) {
        console.log(error)
        throw new Error('Can not query todos')
    }
}

export async function addTodo( _: never, args: TodoObject ) {
    console.log(args)
    const newTodo = {
        completed: false,
        subject: args.subject,
        todo: args.todo,
        createdBy: args.createdBy,
        dueDate: args.dueDate,
        didUserLike: false,
    }
    try {
        const todo = await Todo.create(newTodo);
        console.log(todo)
        return todo;
    } catch(error) {
        console.log(error)
        throw new Error('Can not create todo!')
    }
}

export async function getTodoById(_: never, args: TodoObject, context: Auth ) {
    const { id } = context.verify() as UserPayload;

    try {
        const todo = await Todo.findById(args.id) as unknown as TodoObject;
        let liked: boolean = false;
        if(todo.likedBy[id]) liked = true;
        return {
            completed: todo.completed,
            likedBy: getAllUsersThatLikedTodo(todo.likedBy), 
            _id: todo.id,
            subject: todo.subject,
            todo: todo.todo,
            createdBy: getUserById(todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: liked,
            // key -> comment _id and value user _id
            comments: getAllCommentsAssicotedWithTodoID(todo.comments)
        }

    } catch (error) {
        console.log(error);
        throw new Error('can not get todo')
    }
}

export async function likeTodo(  _: never, args: { type: string, id: TodoObject }, context: Auth ) {

    const { username, id } =  context.verify();

    try{ 
        if(!id) throw new ApolloError('No User is Logged In!');
        const todo = await Todo.findById(args.id) as unknown as TodoObject;

        if( args.type === 'like' ) {
            todo.likedBy[id] = todo.id;
            console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
        }

        if( args.type === 'like' ) {
            delete todo.likedBy[id]
            console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
        }

        await todo.save();
        return todo;

    } catch(error) {
        console.log(error);
        throw new ApolloError('Can not perfomr this action: Server Error')
    }
}