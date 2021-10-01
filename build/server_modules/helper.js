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
exports.isCorrectPassword = exports.getAllCommentsAssicotedWithTodoID = exports.getAllUsersThatLikedTodo = exports.getTodosByUserId = exports.getUserById = void 0;
// models 
const todoModel_1 = __importDefault(require("../server_modules/models/todoModel"));
const commentModel_1 = __importDefault(require("../server_modules/models/commentModel"));
const apollo_server_express_1 = require("apollo-server-express");
const userModel_1 = __importDefault(require("./models/userModel"));
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(id);
    if (!user)
        return null;
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        todos: exports.getTodosByUserId.bind(this, user.id),
        comments: user === null || user === void 0 ? void 0 : user.comments,
        friends: user === null || user === void 0 ? void 0 : user.friends,
    };
});
exports.getUserById = getUserById;
const getTodosByUserId = (createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield todoModel_1.default.find({ createdBy });
    if (!todos)
        throw new apollo_server_express_1.ApolloError(`Can not find todos when queried by user's id or no user was logged in...`);
    return todos.map((todo) => {
        let liked = false;
        if (todo.likedBy[createdBy])
            liked = true;
        return {
            didUserLike: liked,
            completed: todo.completed,
            likedBy: (0, exports.getAllUsersThatLikedTodo)(todo.likedBy),
            id: todo.id,
            subject: todo.subject,
            todo: todo.todo,
            createdAt: (0, moment_1.default)(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: exports.getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            comments: getAllCommentsAssicotedWithTodoID.bind(this, todo.comments)
        };
    });
});
exports.getTodosByUserId = getTodosByUserId;
const getAllUsersThatLikedTodo = (likers) => __awaiter(void 0, void 0, void 0, function* () {
    const keys = Object.keys(likers);
    if (keys.length === 0)
        return [];
    const users = yield userModel_1.default.find({ 'id': { $in: keys } });
    return users.map(user => {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: exports.getTodosByUserId.bind(this, user.id),
            //comments: user.comments,
        };
    });
});
exports.getAllUsersThatLikedTodo = getAllUsersThatLikedTodo;
function getAllCommentsAssicotedWithTodoID(dictionary) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = Object.keys(dictionary);
        if (keys.length === 0)
            return [];
        console.log(keys);
        const comments = commentModel_1.default.find({ "id": { $in: keys } }).sort({ createdAt: 'desc' });
        return comments.map(comment => {
            return {
                id: comment.id,
                createdBy: (0, exports.getUserById)(comment.createdBy),
                comments: comment.comment,
                todoId: comment.todoId,
                createdAt: (0, moment_1.default)(comment.createdAt).format("YYYY-MM-DD hh:mm:ss a")
            };
        });
    });
}
exports.getAllCommentsAssicotedWithTodoID = getAllCommentsAssicotedWithTodoID;
function isCorrectPassword({ attemptPassword, correctPassword }) {
    if (!correctPassword)
        throw new apollo_server_express_1.ApolloError('No User Found with Credentials Entered');
    return bcrypt_1.default.compare(attemptPassword, correctPassword);
}
exports.isCorrectPassword = isCorrectPassword;
