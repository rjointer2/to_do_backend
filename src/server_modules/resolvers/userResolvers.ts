
// Modules
import { AuthenticationError, ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";

// Models
import User, { UserSchemaDefinition } from '../models/userModel';
import Todo from '../models/todoModel';
import Comment from "../models/commentModel";

// helpers
import { getTodosByUserId, image, isCorrectPassword } from "../helper";

// types
import { Auth, UserPayload } from "../type";
import { cloudinaryAPI } from "../middleware/cloudinaryAPI";

export const me = async ( _: never, _args: never, context: Auth ) => {

    const { id, username }: UserPayload = context.verify();
    const user = await User.findById(id);
    if(!user) throw new AuthenticationError('Authentican Error! You must be logged in!');

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(id),
        picture: image(id)
    }
}

export async function user ( _: never, args: { id: string }, context: Auth ) {


    const user = await User.findById(args.id);
    if(!user) throw new AuthenticationError('No User Found');
    return { 
        id: user.id,
        username: user.username,
        email: user.email,
        todos: getTodosByUserId(user.id),
        picture: image(user.id)
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
            todos: getTodosByUserId(user.id),
            picture: image(user.id)
        }
    })
}

export async function sign( _: never, args: { type: string, password: string, username: string, email: string }, context: Auth ) {
    console.log(args)
    if(args.type === 'sign_out') {
        context.endSession();
        return {
            token: null
        }
    }

    if( args.type === 'sign_in' ) {
        console.log(args.type)
        const user = await User.findOne({ username: args.username });
        if(!user) {
            console.log('no user found')
            throw new ApolloError('No User Found with Credentials Entered');
        }
        const isCorrectPasswordValue = isCorrectPassword({ attemptPassword: args.password, correctPassword: user.password });
        if(!isCorrectPasswordValue) throw new AuthenticationError('Incorrect Password was used');
        // sign the user's data to a token for auth 
        console.log(user.id, user._id, "these are ids")
        const token = context.authenticate({ username: user.username, email: user.email, id: user.id.toString() });
        // return the token and user
        return { token, user };
    }

    if( args.type === 'sign_up' ) {
        console.log(args.email)
        try {
            const user = await User.create({
                username: args.username, email: args.email, todos: {},
                comments: {}, password: args.password, likedTodos: {}
            });
            console.log(user)
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

export const updateUser = async ( _: never, args: {  picture: string, username: string, email: string, password: string, confirmPassword: string, [index: string]: any }, context: Auth ) => {
    
    const { id, username }: UserPayload = context.verify();

    const user = await User.findById(id);
    if(!user) throw new ApolloError(`Can't find user at updateUser resolver`)



    if(args.username.length === 0) {
        const ifUsernameExist = await User.findOne({ "username": args.username })
        console.log(ifUsernameExist)
        if(ifUsernameExist !== null ) {
            console.log(`Username: ${args.username} already exist`)
            throw new ApolloError(`Username: ${args.username} already exist`)
        }
    }
        


    if(args.password.length !== 0) {
        const newPassword = await bcrypt.hash(args.password, 10);
        user.password = newPassword;
        // check password comparsion
        if(!await isCorrectPassword({ attemptPassword: args.password, correctPassword: user.password })) {
            throw new ApolloError('failed password check')
        }
    } 


    if(args.picture.length !== 0 ) {
        const imageResponse = await cloudinaryAPI.uploader.upload(args.picture, { 
            upload_preset: 'todo_images',
            public_id: id
        })
        console.log(imageResponse, "hello this is ")
    }
    return {
        id: user.id
    }
}

export const deleteUser = async ( _: never, args: { password: string }, context: Auth ) => {
    const { id, username } = context.verify();
    const user = await User.findById(id);

    if(!user) throw new ApolloError('Could find user when deleteing user, action exited');

    if(!await isCorrectPassword({ attemptPassword: args.password, correctPassword: user.password })) {
        throw new ApolloError('failed password check')
    }

    const len = Object.keys(user.likedTodos).length

    if( len > 0 ) {
        for(let todoId in user.likedTodos) {
            console.log(todoId)
            const todo = await Todo.findById(todoId);
            if(!todo) throw new ApolloError('no todo found when deleting user and data...')
            delete todo.likedBy[id]
            console.log(`${todo.subject} was successfully unliked by ${username}, when deleteing user ${username}`)
    
            todo.markModified("likedBy");
            await todo.save();
        }
    }

    await Comment.deleteMany({ "createdBy": id })
    await Todo.deleteMany({ "createdBy": id });
    cloudinaryAPI.uploader.destroy(id, (res) => console.log(`image was destoryed`, res))
    
    user.delete()
    console.log("user was delete")
    
}