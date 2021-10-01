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
exports.deleteTodo = exports.updateTodo = exports.likeTodo = exports.getTodoById = exports.addTodo = exports.searchTodos = exports.todos = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const moment_1 = __importDefault(require("moment"));
const helper_1 = require("../helper");
const todoModel_1 = __importDefault(require("../models/todoModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const todos = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = context.verify();
    const todos = yield todoModel_1.default.find().sort({ createdAt: 'desc' });
    if (!todos)
        throw new apollo_server_express_1.ApolloError('Can not query todos');
    return todos.slice(args.offset, args.limit).map(todo => {
        return {
            id: todo.id.toString(),
            likedBy: (0, helper_1.getAllUsersThatLikedTodo)(todo.likedBy),
            subject: todo.subject,
            completed: todo.completed,
            todo: todo.todo,
            createdBy: helper_1.getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: todo.likedBy[id] ? true : false,
            createdAt: (0, moment_1.default)(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            comments: (0, helper_1.getAllCommentsAssicotedWithTodoID)(todo.comments)
        };
    });
});
exports.todos = todos;
const searchTodos = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = context.verify();
    const todos = yield todoModel_1.default.find({ "subject": { $regex: args.value } });
    if (!todos)
        throw new apollo_server_express_1.ApolloError('Server error when querying all Todos...');
    return todos.map(todo => {
        return {
            id: todo.id.toString(),
            likedBy: (0, helper_1.getAllUsersThatLikedTodo)(todo.likedBy),
            subject: todo.subject,
            completed: todo.completed,
            todo: todo.todo,
            createdBy: helper_1.getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: todo.likedBy[id] ? true : false,
            createdAt: (0, moment_1.default)(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            comments: (0, helper_1.getAllCommentsAssicotedWithTodoID)(todo.comments)
        };
    });
});
exports.searchTodos = searchTodos;
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
            comments: {},
            likedBy: {}
        };
        const user = yield userModel_1.default.findById(id);
        if (!user) {
            throw new apollo_server_express_1.ApolloError('Can not find user when adding Todo, todo creation exited was exited');
        }
        const todo = yield todoModel_1.default.create(newTodo);
        console.log(todo);
        if (!todo)
            throw new apollo_server_express_1.ApolloError('Cannot make a todo...');
        user.todos[todo.id] = todo.todo;
        user.markModified("todos");
        yield user.save();
        return todo;
    });
}
exports.addTodo = addTodo;
const getTodoById = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = context.verify();
    try {
        const todo = yield todoModel_1.default.findById(args.id);
        let liked = false;
        if (!todo)
            throw new apollo_server_express_1.ApolloError('Can not find todo');
        if (todo.likedBy[id])
            liked = true;
        return {
            id: todo.id.toString(),
            likedBy: (0, helper_1.getAllUsersThatLikedTodo)(todo.likedBy),
            subject: todo.subject,
            completed: todo.completed,
            todo: todo.todo,
            createdBy: helper_1.getUserById.bind(this, todo.createdBy),
            dueDate: todo.dueDate,
            didUserLike: liked,
            createdAt: (0, moment_1.default)(todo.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            comments: (0, helper_1.getAllCommentsAssicotedWithTodoID)(todo.comments)
        };
    }
    catch (error) {
        console.log(error);
        throw new Error('can not get todo');
    }
});
exports.getTodoById = getTodoById;
function likeTodo(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, id } = context.verify();
        try {
            if (id.includes("No"))
                throw new apollo_server_express_1.ApolloError('No User is Logged In!');
            const todo = yield todoModel_1.default.findById(args.id);
            if (!todo)
                throw new apollo_server_express_1.ApolloError('Can not find todo with querying likes');
            if (args.type === 'like') {
                todo.likedBy[id] = todo.id;
                console.log(`${username} liked ${todo.createdBy}'s post -> ${todo.subject}`);
                console.log(todo.likedBy);
            }
            if (args.type === 'unlike') {
                delete todo.likedBy[id];
                console.log(`${username} unliked ${todo.createdBy}'s post -> ${todo.subject}`);
            }
            todo.markModified("likedBy");
            yield todo.save();
        }
        catch (error) {
            console.log(error);
            throw new apollo_server_express_1.ApolloError('Can not perfomr this action: Server Error');
        }
    });
}
exports.likeTodo = likeTodo;
const updateTodo = (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/");
    const todo = yield todoModel_1.default.findById(args.id);
    if (!todo) {
        console.log("Can not find todo at updateTodo resolver");
        throw new apollo_server_express_1.ApolloError("Can not find todo...");
    }
    if (args.option in todo) {
        todo[args.option] = args.value;
        yield todo.save();
        console.log(todo);
        return {
            id: todo.id
        };
    }
    throw new apollo_server_express_1.ApolloError(`${args.option} is not a valid option in the proptery of the todo schema...`);
});
exports.updateTodo = updateTodo;
const deleteTodo = (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = context.verify();
    const user = yield userModel_1.default.findById(id);
    if (!user)
        throw new apollo_server_express_1.ApolloError('Can not find user when deleting todo, action exited');
    const todo = yield todoModel_1.default.findByIdAndDelete(args.id);
    if (!todo) {
        console.log("Can not find todo at deleteTodo resolver");
        throw new apollo_server_express_1.ApolloError("Can not find todo...");
    }
    delete user.todos[todo.id];
    user.markModified("todos");
    yield user.save();
    return {
        id: todo.id,
        subject: todo.subject,
        todo: todo.todo,
    };
});
exports.deleteTodo = deleteTodo;
