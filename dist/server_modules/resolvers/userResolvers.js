"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.sign = exports.searchUsers = exports.user = exports.me = void 0;
// Modules
const apollo_server_express_1 = require("apollo-server-express");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Models
const userModel_1 = __importDefault(require("../models/userModel"));
const todoModel_1 = __importDefault(require("../models/todoModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
// helpers
const helper_1 = require("../helper");
const cloudinaryAPI_1 = require("../middleware/cloudinaryAPI");
const me = (_, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username } = context.verify();
    const user = yield userModel_1.default.findById(id);
    if (!user)
        throw new apollo_server_express_1.AuthenticationError('Authentican Error! You must be logged in!');
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        todos: (0, helper_1.getTodosByUserId)(id),
        picture: (0, helper_1.image)(id)
    };
});
exports.me = me;
function user(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(args.id);
        if (!user)
            throw new apollo_server_express_1.AuthenticationError('No User Found');
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            todos: (0, helper_1.getTodosByUserId)(user.id),
            picture: (0, helper_1.image)(user.id)
        };
    });
}
exports.user = user;
const searchUsers = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(args);
    const users = yield userModel_1.default.find({ "username": { $regex: args.value } }).sort({ "username": 1 });
    if (!users)
        return [];
    return users.map(user => {
        console.log(user);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            todos: (0, helper_1.getTodosByUserId)(user.id),
            picture: (0, helper_1.image)(user.id)
        };
    });
});
exports.searchUsers = searchUsers;
function sign(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(args);
        if (args.type === 'sign_out') {
            context.endSession();
            return {
                token: null
            };
        }
        if (args.type === 'sign_in') {
            console.log(args.type);
            const user = yield userModel_1.default.findOne({ username: args.username });
            if (!user) {
                console.log('no user found');
                throw new apollo_server_express_1.ApolloError('No User Found with Credentials Entered');
            }
            const isCorrectPasswordValue = (0, helper_1.isCorrectPassword)({ attemptPassword: args.password, correctPassword: user.password });
            if (!isCorrectPasswordValue)
                throw new apollo_server_express_1.AuthenticationError('Incorrect Password was used');
            // sign the user's data to a token for auth 
            const token = context.authenticate({ username: user.username, email: user.email, id: user._id.toString() });
            // return the token and user
            return { token, user };
        }
        if (args.type === 'sign_up') {
            console.log(args.email);
            try {
                const user = yield userModel_1.default.create({
                    username: args.username, email: args.email, todos: {},
                    comments: {}, password: args.password, likedTodos: {}
                });
                console.log(user);
                const token = context.authenticate({ username: user.username, email: user.email, id: user._id });
                return { token, user };
            }
            catch (error) {
                if (error.message.includes("E11000")) {
                    console.log(error);
                    throw new apollo_server_express_1.ApolloError(`${args.username} is a existing username, please use an alternative.`);
                }
                if (error.message.includes("Users validation")) {
                    console.log(error);
                    throw new apollo_server_express_1.ApolloError(`${error.message}`);
                }
                throw new apollo_server_express_1.ApolloError(`Can not accesss server / database at this time... :[`);
            }
        }
    });
}
exports.sign = sign;
const updateUser = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username } = context.verify();
    const user = yield userModel_1.default.findById(id);
    if (!user)
        throw new apollo_server_express_1.ApolloError(`Can't find user at updateUser resolver`);
    if (args.username.length === 0) {
        const ifUsernameExist = yield userModel_1.default.findOne({ "username": args.username });
        console.log(ifUsernameExist);
        if (ifUsernameExist !== null) {
            console.log(`Username: ${args.username} already exist`);
            throw new apollo_server_express_1.ApolloError(`Username: ${args.username} already exist`);
        }
    }
    if (args.password.length !== 0) {
        const newPassword = yield bcrypt_1.default.hash(args.password, 10);
        user.password = newPassword;
        // check password comparsion
        if (!(yield (0, helper_1.isCorrectPassword)({ attemptPassword: args.password, correctPassword: user.password }))) {
            throw new apollo_server_express_1.ApolloError('failed password check');
        }
    }
    if (args.picture.length !== 0) {
        const imageResponse = yield cloudinaryAPI_1.cloudinaryAPI.uploader.upload(args.picture, {
            upload_preset: 'todo_images',
            public_id: id
        });
        console.log(imageResponse, "hello this is ");
    }
    return {
        id: user.id
    };
});
exports.updateUser = updateUser;
const deleteUser = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username } = context.verify();
    const user = yield userModel_1.default.findById(id);
    if (!user)
        throw new apollo_server_express_1.ApolloError('Could find user when deleteing user, action exited');
    if (!(yield (0, helper_1.isCorrectPassword)({ attemptPassword: args.password, correctPassword: user.password }))) {
        throw new apollo_server_express_1.ApolloError('failed password check');
    }
    const len = Object.keys(user.likedTodos).length;
    if (len > 0) {
        for (let todoId in user.likedTodos) {
            console.log(todoId);
            const todo = yield todoModel_1.default.findById(todoId);
            if (!todo)
                throw new apollo_server_express_1.ApolloError('no todo found when deleting user and data...');
            delete todo.likedBy[id];
            console.log(`${todo.subject} was successfully unliked by ${username}, when deleteing user ${username}`);
            todo.markModified("likedBy");
            yield todo.save();
        }
    }
    yield commentModel_1.default.deleteMany({ "createdBy": id });
    yield todoModel_1.default.deleteMany({ "createdBy": id });
    cloudinaryAPI_1.cloudinaryAPI.uploader.destroy(id, (res) => console.log(`image was destoryed`, res));
    user.delete();
    console.log("user was delete");
});
exports.deleteUser = deleteUser;
