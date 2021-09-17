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
exports.sign = exports.me = void 0;
// Modules
const apollo_server_express_1 = require("apollo-server-express");
// Models
const userModel_1 = __importDefault(require("../models/userModel"));
// helpers
const helper_1 = require("../helper");
function me(_, _args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('?');
        const { id } = context.verify();
        console.log(id);
        const user = yield userModel_1.default.findById(id);
        if (!user)
            throw new apollo_server_express_1.AuthenticationError('Authentican Error! You must be logged in!');
        console.log(user.id);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            todos: (0, helper_1.getTodosByUserId)(id)
            //comments: getAllCommentsAssicotedWithTodoID(user.comments),
        };
    });
}
exports.me = me;
function sign(_, args, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (args.type === 'sign_out') {
            context.endSession();
        }
        if (args.type === 'sign_in') {
            console.log(args.type);
            const user = yield userModel_1.default.findOne({ usernme: args.username });
            if (!user)
                throw new apollo_server_express_1.ApolloError('No User Found with Credentials Entered');
            const isCorrectPasswordValue = (0, helper_1.isCorrectPassword)({ password: args.password, correctPassword: user.password });
            if (!isCorrectPasswordValue)
                throw new apollo_server_express_1.AuthenticationError('Incorrect Password was used');
            // sign the user's data to a token for auth 
            const token = context.authenticate({ username: user.username, email: user.email, id: user._id.toString() });
            // return the token and user
            return { token, user };
        }
        if (args.type === 'sign_up') {
            try {
                const user = yield userModel_1.default.create({
                    username: args.username, email: args.email, todos: {},
                    comments: {}, friends: {}, password: args.password
                });
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
