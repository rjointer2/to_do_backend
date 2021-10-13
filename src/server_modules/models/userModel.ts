
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserSchema {
    username: string
    email: object | string
    password: string
    todos: object
    comments: object
    likedTodos: any
}

export interface UserSchemaDefinition {
    [index: string]: any
    id: string
    username: string
    email: string
    password?: string
    todos: { [index: string]: any }
    comments: object
    likedTodos: {[index: string]: any}
}

const userSchema = new Schema<UserSchema>(
    {
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
            type: Schema.Types.Mixed,
            required: true,
        },
        comments: {
            type: Schema.Types.Mixed,
            required: true,
        },
        likedTodos: {
            type: Schema.Types.Mixed,
            required: true,
        }
        
    },
    { timestamps: true, minimize: false },
);

// set up pre-save middleware to create password
userSchema.pre('save', async function(next): Promise<void> {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

const User = model<UserSchemaDefinition>('Users', userSchema);

export default  User;