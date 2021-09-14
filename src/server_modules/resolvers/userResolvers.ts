
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";

// Models
import User, { UserSchemaDefinition } from '../models/userModel';
import Todo from '../models/todoModel';

// helpers
import { getAllCommentsAssicotedWithTodoID, getTodosByUserId, isCorrectPassword } from "../helper";

// types
import { Auth, UserPayload } from "../type";


export async function me( _: never, _args: never, context: Auth ) {
    console.log('?')
    const { id }: UserPayload = context.verify();
    console.log(id)
    const user = await User.findById(id);
    if(!user) throw new AuthenticationError('Authentican Error! You must be logged in!');
    console.log(user.id)
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(id)
        //comments: getAllCommentsAssicotedWithTodoID(user.comments),
    }
}

export async function sign( _: never, args: { type: string, password: string, username: string, email: string }, context: Auth ) {

    if(args.type === 'sign_out') {
        context.endSession();
    }

    if( args.type === 'sign_in' ) {
        console.log(args.type)
        const user = await User.findOne({ usernme: args.username });
        if(!user) throw new ApolloError('No User Found with Credentials Entered');
        const isCorrectPasswordValue = isCorrectPassword({ password: args.password, correctPassword: user.password });
        if(!isCorrectPasswordValue) throw new AuthenticationError('Incorrect Password was used');
        // sign the user's data to a token for auth 
        const token = context.authenticate({ username: user.username, email: user.email, id: user._id.toString() });
        // return the token and user
        return { token, user };
    }

    if( args.type === 'sign_up' ) {
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