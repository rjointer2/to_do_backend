
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserSchema {
    username: string
    email: object | string
    password: string
    todos: object
    comments: object
    friends: object
}

export interface UserSchemaDefinition {
    username: string
    email: string
    password: string
    todos: object
    comments: object
    friends: object
    isCorrectPassword: ( x: string ) => boolean
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
            type: [Schema.Types.Mixed],
            ref: 'Todo'
        },
        comments: {
            type: [Schema.Types.Mixed],
            ref: 'Comment'
        },
        friends: {
            type: [Schema.Types.Mixed],
            ref: 'User'
        }
    }
);

// set up pre-save middleware to create password
userSchema.pre('save', async function(next): Promise<void> {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
  
// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password: string): Promise<boolean> {
return bcrypt.compare(password, this.password);
};


const User = model<UserSchemaDefinition>('Users', userSchema);

export default  User;