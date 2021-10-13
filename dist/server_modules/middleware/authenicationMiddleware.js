"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
// set token secret and expiration date         
const secret = process.env.SECRET;
const expiration = '2h';
function authenicationMiddleware({ req, rep }) {
    return {
        authenticate: function ({ username, email, id }) {
            const payload = { username, email, id };
            const token = jsonwebtoken_1.default.sign({ data: payload }, secret, { expiresIn: expiration });
            req.header.authorization = token;
            console.log(req.header.authorization);
            // return the token to the sign in resolver
            console.log(`${username} is being authiencated...`);
            return token;
        },
        verify: function () {
            var _a;
            console.log(req.header.authorization);
            // if the header is falsy then return a object with user and let
            // the me query error this auth error
            if (!req.header.authorization)
                return { username: "No User Found", email: "No Email Found", id: "No ID was found" };
            // decode the payload from the header
            console.log('hi');
            const token = (_a = req.header.authorization.split(' ').pop()) === null || _a === void 0 ? void 0 : _a.trim();
            const { data } = jsonwebtoken_1.default.verify(token, secret, { maxAge: expiration });
            console.log(`${data.username} was verified...`);
            return { username: data.username, email: data.email, id: data.id };
        },
        endSession: function () {
            req.header.authorization = null;
            console.log(`The user's session ended...`);
        }
    };
}
exports.default = authenicationMiddleware;
