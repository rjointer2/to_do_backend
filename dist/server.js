"use strict";
// You will NOT have the any env variables for 
// this repo, you must make your own configurations
// for reproduction
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
require('dotenv').config();
// port 
const _PORT = process.env.PORT || 4562;
// modules
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
// TypeDefs
const typeDefs_1 = __importDefault(require("./server_modules/schemas/typeDefs"));
// Resolvers 
const rootResolver_1 = __importDefault(require("./server_modules/schemas/rootResolver"));
// Authentication Middleware
const authenicationMiddleware_1 = __importDefault(require("./server_modules/middleware/authenicationMiddleware"));
// apollo server that will typeDefs, resolvers, and schema, and any other middleware
const initApollo = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.default /* Type Definitions Here */,
    resolvers: rootResolver_1.default /* Resolvers Here */,
    context: authenicationMiddleware_1.default, /* Middleware Here */
});
// connection to DB
mongoose_1.default.connect(`mongodb+srv://${process.env.UN}:${process.env.PW}@cluster0.zb3af.mongodb.net/${process.env.DB}?retryWrites=true&w=majority` || `http://localhost:${_PORT}`, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`connected to ${process.env.DB}`);
    const server = (0, express_1.default)();
    yield initApollo.start();
    initApollo.applyMiddleware({ app: server });
    server.listen(_PORT, () => {
        console.log(`🚀 Server is running with no issues, click here to open http://localhost:${_PORT}/graphql`);
    });
}));
