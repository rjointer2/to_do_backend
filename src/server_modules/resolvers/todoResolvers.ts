
import Todo from '../models/todoModel';
import { Auth, UserPayload, TodoObject } from '../type';

export async function todos ( _: never, args: { offset: number, limit: number }, context: Auth ) {
    const { username, email, id } = context.verify() as UserPayload;
    try {
       const todos = await Todo.find().sort({ createdAt: 'desc' }) as unknown as Array<TodoObject>
        return todos.slice(args.offset, args.limit).map(todo => {
            let liked: boolean = false;
            const dictionary = JSON.parse(todo.likedBy);
            if(dictionary[id]) liked = true;
            return {
                id: todo.id.toString(),
                likedBy: todo.likedBy, 
                subject: todo.subject,
                todo: todo.todo,
                createdBy: todo.createdBy,
                dueDate: todo.dueDate,
                didUserLike: todo.didUserLike,
                comment: todo.comments
            }
        })
    } catch(err) {

    }
}

export async function addTodo( _: never, args: TodoObject ) {
    console.log(args)
    try {
        const todo = await Todo.create({  
            completed: false,
            subject: args.subject,
            todo: args.todo,
            createdBy: args.createdBy,
            dueDate: args.dueDate,
            didUserLike: false,
        });
        console.log(todo)
        return todo;
    } catch(error) {
        console.log(error)
        throw new Error('Can not create todo!')
    }
}