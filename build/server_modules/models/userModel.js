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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // not sure if this is a bug in the type def for moongoose, 
    // but reads email as string
    email: {
        type: String,
        match: [/.+@.+\..+/, 'Must match an email address!'],
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    todos: {
        type: mongoose_1.Schema.Types.Mixed,
        ref: 'Todo'
    },
    comments: {
        type: {},
        ref: 'Comment'
    },
});
// set up pre-save middleware to create password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || this.isModified('password')) {
            const saltRounds = 10;
            this.password = yield bcrypt_1.default.hash(this.password, saltRounds);
        }
        next();
    });
});
const User = (0, mongoose_1.model)('Users', userSchema);
exports.default = User;
