
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";

// Models
import User, { UserSchemaDefinition } from '../models/userModel';
import Todo from '../models/todoModel';

// helpers
import { getAllCommentsAssicotedWithTodoID, getTodosByUserId } from "../helper";

// types
import { Auth, UserObject, UserPayload } from "../type";
import { Condition } from "mongoose";

export async function me( _: never, _args: never, context: Auth ) {
    const { id }: UserPayload = context.verify();
    const user = await User.findById(id);
    if(!user) throw new AuthenticationError('Authentican Error! You must be logged in!')
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(user.id),
        //comments: getAllCommentsAssicotedWithTodoID(user.comments),
    }
}

export async function sign( _: never, args: { type: string, password: string, username: string, email: string }, context: Auth ) {
    const { id }: UserObject = context.verify();
    console.log("hi")
    if(args.type === 'sign_out') {
        context.endSession();
    }

    if( args.type === 'sign_in' ) {
        console.log(args.type)
        const user = await User.findOne({ usernme: args.username });
        if(!user) throw new AuthenticationError('No User Found with Credentials Entered');
        const isCorrectPassword = await user.isCorrectPassword(args.password);
        if(!isCorrectPassword) throw new AuthenticationError('Incorrect Password was used');
        // sign the user's data to a token for auth 
        const token = context.authenticate({ username: user.username, email: user.email, id: user.id });
        // return the token and user
        return { token, user };
    }

    if( args.type === 'sign_up' ) {
        try {
            const user = await User.create({
                username: args.username, email: args.email, todos: {},
                comments: {}, friends: {},  password: args.password
            });
            const token = context.authenticate({ username: user.username, email: user.email, id: user.id });
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