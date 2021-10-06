"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoResolvers_1 = require("../resolvers/todoResolvers");
const userResolvers_1 = require("../resolvers/userResolvers");
const commentResolvers_1 = require("../resolvers/commentResolvers");
let resolvers = {
    Query: {
        me: userResolvers_1.me,
        user: userResolvers_1.user,
        todos: todoResolvers_1.todos,
        getTodoById: todoResolvers_1.getTodoById,
    },
    Mutation: {
        deleteComment: commentResolvers_1.deleteComment,
        searchUsers: userResolvers_1.searchUsers,
        searchTodos: todoResolvers_1.searchTodos,
        deleteUser: userResolvers_1.deleteUser,
        updateUser: userResolvers_1.updateUser,
        updateTodo: todoResolvers_1.updateTodo,
        deleteTodo: todoResolvers_1.deleteTodo,
        addComment: commentResolvers_1.addComment,
        likeTodo: todoResolvers_1.likeTodo,
        addTodo: todoResolvers_1.addTodo,
        sign: userResolvers_1.sign
    }
};
exports.default = resolvers;
