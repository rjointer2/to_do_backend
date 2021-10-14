
import { ApolloError } from 'apollo-server-express';
import moment from 'moment';

import { getAllCommentsAssicotedWithTodoID, getAllUsersThatLikedTodo, getTodosByUserId, getUserById, image } from '../helper';
import Comment from '../models/commentModel';
import Todo, { TodoSchemaInterface } from '../models/todoModel';
import User from '../models/userModel';


import { Auth, UserPayload } from '../type';

export const todos = async ( _: never, args: { offset: number, limit: number }, context: Auth ) => {
    const { id } = context.verify() as UserPayload;
    const todos = await Todo.find().sort({ createdAt: 'desc' });
    if(!todos) throw new ApolloError('Can not query todos')
    return todos.slice(args.offset, args.limit).map(todo => {
        return {
            id: todo.id.toString(),
            likedBy: getAllUsersThatLikedTodo(todo.likedBy), 
            subject: todo.subject,
            completed: todo.completed,
            todo: todo.todo,
            createdBy: getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: todo.likedBy[id] ? true : false,
            createdAt: moment(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            comments: getAllCommentsAssicotedWithTodoID(todo.comments) 
        }
    })
}

export const addTodo = async ( _: never, args: TodoSchemaInterface, context: Auth ) => {
    const { id } = context.verify()
    console.log(args)
    const newTodo = {
        completed: false,
        subject: args.subject,
        todo: args.todo,
        createdBy: id,
        dueDate: args.dueDate,
        didUserLike: false,
        comments: {},
        likedBy: {}
    }
   
    const user = await User.findById(id);
    if(!user) {
        throw new ApolloError('Can not find user when adding Todo, todo creation exited was exited')
    }

    const todo = await Todo.create(newTodo);
    console.log(todo.id)
    if(!todo) throw new ApolloError('Cannot make a todo...');
    console.log(user)

    user.todos[todo.id] = todo.todo;
    user.markModified("todos");
    await user.save()


    return todo;
}

export const getTodoById = async (_: never, args: TodoSchemaInterface, context: Auth ) => {
    const { id } = context.verify() as UserPayload;

    try {
        const todo = await Todo.findById(args.id);
        let liked: boolean = false;
        if(!todo) throw new ApolloError('Can not find todo')
        if(todo.likedBy[id]) liked = true;
        
        return {
            likedBy: getAllUsersThatLikedTodo(todo.likedBy), 
            id: todo.id,
            subject: todo.subject,
            completed: todo.completed,
            todo: todo.todo,
            createdBy: getUserById.bind(this, todo.createdBy),
            picture: image(todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: liked,
            createdAt: moment(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            comments: getAllCommentsAssicotedWithTodoID(todo.comments) 
        }
    } catch (error) {
        console.log(error);
        throw new Error('can not get todo')
    }
}

export const likeTodo = async (  _: never, args: { type: string, id: TodoSchemaInterface }, context: Auth ) => {

    const { username, id } =  context.verify();
    const user = await User.findById(id);

    if(!user) { 
        console.log("No user found when liking todo...")
        throw new ApolloError("no user found when liking todo.. ")
    }

    try{ 
        if(id.includes("No")) throw new ApolloError('No User is Logged In!');
        const todo = await Todo.findById(args.id);
        if(!todo) throw new ApolloError('Can not find todo with querying likes')

        if( args.type === 'like' ) {
            todo.likedBy[id] = username;
            console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
            console.log(todo.likedBy)
            user.likedTodos[todo.id] = todo.subject
        }

        if( args.type === 'unlike' ) {
            delete todo.likedBy[id]
            delete user.likedTodos[todo.id]
            console.log(todo.likedBy)
            console.log(`${username} unliked ${todo.createdBy}'s post -> ${todo.subject}`);
        }

        todo.markModified("likedBy")
        user.markModified("likedTodos")
        await todo.save();
        await user.save();

    } catch(error) {
        console.log(error);
        throw new ApolloError('Can not perfomr this action: Server Error')
    }
}

export const updateTodo = async ( _: never, args: { option: string, id: string, value: string } ) => {
    console.log("/")
    const todo = await Todo.findById(args.id);
    if(!todo) {
        console.log("Can not find todo at updateTodo resolver")
        throw new ApolloError("Can not find todo...")
    }
    if(args.option in todo) {
        todo[args.option] = args.value
        await todo.save()
        console.log(todo)
        return { 
            id: todo.id
        }
    }
    throw new ApolloError(`${args.option} is not a valid option in the proptery of the todo schema...`)
}

export const deleteTodo = async ( _: never, args: { id: string }, context: Auth ) => {
    const { id } = context.verify();
    const user = await User.findById(id);

    if(!user) throw new ApolloError('Can not find user when deleting todo, action exited');
    const todo = await Todo.findByIdAndDelete(args.id);
    if(!todo) {
        console.log("Can not find todo at deleteTodo resolver")
        throw new ApolloError("Can not find todo...")
    }

    delete user.todos[todo.id];
    user.markModified("todos");

    const dictionary = Object.keys(user.comments)
    await Comment.deleteMany({ "createdBy": { $in: dictionary } })

    await user.save();



    return {
        id: todo.id,
        subject: todo.subject,
        todo: todo.todo,
    }
}