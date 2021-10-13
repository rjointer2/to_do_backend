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
exports.deleteComment = exports.addComment = void 0;
// Modules
const commentModel_1 = __importDefault(require("../models/commentModel"));
const todoModel_1 = __importDefault(require("../models/todoModel"));
// Apollo 
const apollo_server_express_1 = require("apollo-server-express");
//helpers
function addComment(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, username } = context.verify();
        const comment = yield commentModel_1.default.create({
            createdBy: args.createdBy,
            comment: args.comment,
            todoID: args.todoID
        });
        if (!comment)
            throw new apollo_server_express_1.ApolloError('can not make comment under todo');
        const todo = yield todoModel_1.default.findById(comment.todoID); // this is the todo id 
        if (!todo)
            throw new apollo_server_express_1.ApolloError('Can not find todo when creating comment');
        todo.comments[comment._id] = id;
        console.log(`${username} added a commented`);
        todo.markModified("comments");
        yield todo.save();
        console.log(comment);
        return {
            id: comment.id,
            createdBy: comment.createdBy,
            comment: comment.comment,
            todoID: comment.todoID
        };
    });
}
exports.addComment = addComment;
function deleteComment(_, args) {
    return __awaiter(this, void 0, void 0, function* () {
        // key -> comment _id and value user _id
        const comment = yield commentModel_1.default.findById(args.id);
        if (!comment)
            throw new apollo_server_express_1.ApolloError('Comment not found...');
        const todo = yield todoModel_1.default.findById(comment.todoID);
        if (!todo)
            throw new apollo_server_express_1.ApolloError('Todo not found...');
        // is in todo model find the comment prop and search for the 
        // comment id and delete the dictionary then the comment itself
        delete todo.comments[comment._id];
        todo.markModified("comments");
        console.log(comment.id);
        yield todo.save();
        // now delete the Comment 
        yield commentModel_1.default.findByIdAndDelete(comment.id);
        return {
            comment: 'this comment was deleted...'
        };
    });
}
exports.deleteComment = deleteComment;