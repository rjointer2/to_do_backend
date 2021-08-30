
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";

// Models
import User from '../models/userModel';
import Todo from '../models/todoModel';

// helpers
import { getTodosByUserId } from "../helper";

// types
import { Auth, UserObject, UserPayload } from "../type";

export async function me( _: never, _args: never, context: Auth ) {
    const { id }: UserPayload = context.verify();
    try{
        const user = await User.findById(id) as UserObject;
        if(!id) return user // null;
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            todos: getTodosByUserId(user.id)
        }
    } catch(err) {
        throw new AuthenticationError('Authentican Error! You must be logged in!')
    }
}

export async function sign( _: never, args: { type: string, password: string, email: string, username: string }, context: Auth ) {
    const { id }: UserObject =  context.verify();
    
    if(args.type === 'sign_out') {
        context.endSession();
    }

    if( args.type === 'sign_in' ) {
        const user = await User.findById(id) as UserObject;
        if(!user) throw new AuthenticationError('No User Found with Credentials Entered');
        const isCorrectPassword = await user.isCorrectPassword(args.password);
        if(!isCorrectPassword) throw new AuthenticationError('Incorrect Password was used');
        // sign the user's data to a token for auth 
        const token = context.authenticate(user);
        // return the token and user
        return { token, user };
    }

    if( args.type === 'sign_up' ) {
        try {
            const user = await User.create({
                username: args.username, email: args.email, todos: "",
                comments: "", friends: "",  password: args.password
            });
            const token = context.authenticate(user);
            return { token, user }
        } catch (error) {
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