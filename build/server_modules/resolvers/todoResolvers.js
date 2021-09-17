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
exports.likeTodo = exports.getTodoById = exports.addTodo = exports.todos = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const helper_1 = require("../helper");
const todoModel_1 = __importDefault(require("../models/todoModel"));
function todos(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = context.verify();
        try {
            const todos = yield todoModel_1.default.find().sort({ createdAt: 'desc' });
            console.log(todos);
            return todos.slice(args.offset, args.limit).map(todo => {
                let liked = false;
                if (todo.likedBy[id])
                    liked = true;
                return {
                    id: todo.id,
                    likedBy: (0, helper_1.getAllUsersThatLikedTodo)(todo.likedBy),
                    subject: todo.subject,
                    completed: todo.completed,
                    todo: todo.todo,
                    createdBy: (0, helper_1.getUserById)(todo.createdBy.toString()),
                    dueDate: todo.dueDate,
                    didUserLike: liked,
                    comment: (0, helper_1.getAllCommentsAssicotedWithTodoID)(todo.comments)
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new Error('Can not query todos');
        }
    });
}
exports.todos = todos;
function addTodo(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = context.verify();
        console.log(args);
        const newTodo = {
            completed: false,
            subject: args.subject,
            todo: args.todo,
            createdBy: id,
            dueDate: args.dueDate,
            didUserLike: false,
            comments: {}
        };
        try {
            const todo = yield todoModel_1.default.create(newTodo);
            console.log(todo);
            return todo;
        }
        catch (error) {
            console.log(error);
            throw new Error('Can not create todo!');
        }
    });
}
exports.addTodo = addTodo;
function getTodoById(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = context.verify();
        try {
            const todo = yield todoModel_1.default.findById(args.id);
            let liked = false;
            if (!todo)
                throw new apollo_server_express_1.ApolloError('Can not find todo');
            if (todo.likedBy[id])
                liked = true;
            return {
                completed: todo.completed,
                likedBy: (0, helper_1.getAllUsersThatLikedTodo)(todo.likedBy),
                _id: todo.id,
                subject: todo.subject,
                todo: todo.todo,
                createdBy: (0, helper_1.getUserById)(todo.createdBy),
                dueDate: todo.dueDate,
                didUserLike: liked,
                // key -> comment _id and value user _id
                comments: (0, helper_1.getAllCommentsAssicotedWithTodoID)(todo.comments)
            };
        }
        catch (error) {
            console.log(error);
            throw new Error('can not get todo');
        }
    });
}
exports.getTodoById = getTodoById;
function likeTodo(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, id } = context.verify();
        try {
            if (!id)
                throw new apollo_server_express_1.ApolloError('No User is Logged In!');
            const todo = yield todoModel_1.default.findById(args.id);
            if (!todo)
                throw new apollo_server_express_1.ApolloError('Can not find todo with querying likes');
            if (args.type === 'like') {
                todo.likedBy[id] = todo.id;
                console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
            }
            if (args.type === 'like') {
                delete todo.likedBy[id];
                console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
            }
            yield todo.save();
            return todo;
        }
        catch (error) {
            console.log(error);
            throw new apollo_server_express_1.ApolloError('Can not perfomr this action: Server Error');
        }
    });
}
exports.likeTodo = likeTodo;
