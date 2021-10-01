
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";

// Models
import User, { UserSchemaDefinition } from '../models/userModel';
import Todo from '../models/todoModel';
import Comment from "../models/commentModel";

// helpers
import { getAllCommentsAssicotedWithTodoID, getTodosByUserId, isCorrectPassword } from "../helper";

// types
import { Auth, UserPayload } from "../type";


export async function me( _: never, _args: never, context: Auth ) {
    const { id }: UserPayload = context.verify();
    const user = await User.findById(id);
    if(!user) throw new AuthenticationError('Authentican Error! You must be logged in!');
    console.log(user.todos)
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(id)
        //comments: getAllCommentsAssicotedWithTodoID(user.comments),
    }
}

export async function user( _: never, args: { id: string }, context: Auth ) {
    const user = await User.findById(args.id);
    if(!user) throw new AuthenticationError('No User Found');
    return { 
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(user.id)
    }
}

export const searchUsers = async ( _: never, args: { value: string } ) => {
    console.log(args)
    const users = await User.find({ "username": { $regex: args.value } }).sort({ "username": 1 });
    if(!users) return []
    return users.map(user => {
        console.log(user)
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            todos: getTodosByUserId(user.id)
        }
    })
}

export async function sign( _: never, args: { type: string, password: string, username: string, email: string }, context: Auth ) {
    console.log(args)
    if(args.type === 'sign_out') {
        context.endSession();
    }

    if( args.type === 'sign_in' ) {
        console.log(args.type)
        const user = await User.findOne({ usernme: args.username });
        if(!user) throw new ApolloError('No User Found with Credentials Entered');
        const isCorrectPasswordValue = isCorrectPassword({ attemptPassword: args.password, correctPassword: user.password });
        if(!isCorrectPasswordValue) throw new AuthenticationError('Incorrect Password was used');
        // sign the user's data to a token for auth 
        const token = context.authenticate({ username: user.username, email: user.email, id: user._id.toString() });
        // return the token and user
        return { token, user };
    }

    if( args.type === 'sign_up' ) {
        console.log(args.email)
        try {
            const user = await User.create({
                username: args.username, email: args.email, todos: {},
                comments: {}, friends: {},  password: args.password
            });
            const token = context.authenticate({ username: user.username, email: user.email, id: user._id });
            return { token, user }
        } catch (error: any) {
            if(error.message.includes("E11000")) {
                console.log(error)
                throw new ApolloError(`${args.username} is a existing username, please use an alternative.`)
            }

            if(error.message.includes("Users validation")) {
                console.log(error)
                throw new ApolloError(`${error.message}`)
            }

            throw new ApolloError(`Can not accesss server / database at this time... :[`)
        }
    }
}

export const updateUser = async ( _: never, args: { username: string, email: string, password: string, id: string, confirmPassword: string, [index: string]: any }, context: Auth ) => {
    console.log(args)
    const user = await User.findById(args.id);
    if(!user) throw new ApolloError(`Can't find user at updateUser resolver`)

    if(!(await isCorrectPassword({ attemptPassword: args.confirmPassword, correctPassword: user.password }))) {
        console.log('Password Verification failed')
        throw new ApolloError('Password Verification failed')
    }

    for(let prop in user) {
        if( prop in args ) {
            if(prop === "username") {
                if(args.username.length === 0) { continue; }
                const ifUsernameExist = await User.findOne({ "username": args.username })
                console.log(ifUsernameExist)
                if(ifUsernameExist !== null ) {
                    console.log(`Username: ${args.username} already exist`)
                    throw new ApolloError(`Username: ${args.username} already exist`)
                }
            }


            if(prop === "password") {
                if(args.password.length === 0 ) { continue; }
                const newPassword = await bcrypt.hash(args[prop], 10);
                user[prop] = newPassword;
                // check password comparsion
                if(!await isCorrectPassword({ attemptPassword: args.password, correctPassword: user.password })) {
                    throw new ApolloError('failed password check')
                }
            } else {
                user[prop] = args[prop];
            }
        }
    }
    console.log(user)
}

export const deleteUser = async ( _: never, _args: never, context: Auth ) => {
    const { id } = context.verify();
    const user = await User.findById(id);

    if(!user) throw new ApolloError('Could find user when deleteing user, action exited');
    
    const todoKeys = Object.keys(user.todos);
    await Comment.deleteMany({ "createdBy": id })
    await Todo.deleteMany({ "id": { $in: todoKeys } })
    
}