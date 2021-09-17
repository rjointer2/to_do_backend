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
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(id);
        if (!user)
            throw new apollo_server_express_1.ApolloError('Can not find user');
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            todos: getTodosByUserId(user.id),
            comments: user.comments,
            friends: user.friends,
        };
    });
}
exports.getUserById = getUserById;
function getTodosByUserId(createdBy) {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield todoModel_1.default.find({ "id": createdBy });
        if (!todos)
            throw new apollo_server_express_1.ApolloError(`Can not find todos when queried by user's id or no user was logged in...`);
        return todos.map(todo => {
            return {
                completed: todo.completed,
                likedBy: getAllUsersThatLikedTodo.bind(todo.likedBy),
                id: todo.id,
                subject: todo.subject,
                todo: todo.todo,
                createdBy: getUserById.bind(todo.createdBy),
                dueDate: todo.dueDate
            };
        });
    });
}
exports.getTodosByUserId = getTodosByUserId;
function getAllUsersThatLikedTodo(likers) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = Object.keys(likers);
        const users = yield userModel_1.default.find({ 'username': { $in: keys } }).sort({ createdAt: 'desc' });
        return users.map(user => {
            return {
                id: user.id,
                email: user.email,
                username: user.username,
                todos: getTodosByUserId.bind(user.id),
                comments: user.comments,
                friends: user.friends,
            };
        });
    });
}
exports.getAllUsersThatLikedTodo = getAllUsersThatLikedTodo;
function getAllCommentsAssicotedWithTodoID(dictionary) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = Object.keys(dictionary);
        const comments = commentModel_1.default.find({ "_id": { $in: keys } }).sort({ createdAt: 'desc' });
        return comments.map(comment => {
            return {
                id: comment.id,
                createdBy: getUserById.bind(comment.createdBy),
                comment: comment.comment,
                todoId: comment.todoId,
                createdAt: (0, moment_1.default)(comment.createdAt).format("YYYY-MM-DD hh:mm:ss a")
            };
        });
    });
}
exports.getAllCommentsAssicotedWithTodoID = getAllCommentsAssicotedWithTodoID;
function isCorrectPassword({ password, correctPassword }) {
    if (!correctPassword)
        throw new apollo_server_express_1.ApolloError('No User Found with Credentials Entered');
    return bcrypt_1.default.compare(password, correctPassword);
}
exports.isCorrectPassword = isCorrectPassword;
