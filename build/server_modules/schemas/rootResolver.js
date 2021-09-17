"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoResolvers_1 = require("../resolvers/todoResolvers");
const userResolvers_1 = require("../resolvers/userResolvers");
const commentResolvers_1 = require("../resolvers/commentResolvers");
let resolvers = {
    Query: {
        me: userResolvers_1.me,
        todos: todoResolvers_1.todos,
        getTodoById: todoResolvers_1.getTodoById
    },
    Mutation: {
        deleteComment: commentResolvers_1.deleteComment,
        addComment: commentResolvers_1.addComment,
        likeTodo: todoResolvers_1.likeTodo,
        addTodo: todoResolvers_1.addTodo,
        sign: userResolvers_1.sign
    }
};
exports.default = resolvers;
