
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";

// Models
import User from '../models/userModel';
import Todo from '../models/todoModel';

// helpers
import { getTodosByUserId } from "../helper";

// types
import { Auth, UserObject, UserPayload } from "../type";

export async function me( _: never, args: UserObject, context: Auth ) {
    const { id }: UserPayload = context.verify();
    try{
        const user: null | UserObject = null;
        if(!id) return user // null;
        user = await User.findById(id)
    } catch(err) {

    }
}