
import dotenv from 'dotenv';
import { Response } from 'express';
import jsonwebtoken, { Secret } from 'jsonwebtoken'
import { Auth, RequestWithHeadersAuth, UserPayload } from '../type';

dotenv.config();

// set token secret and expiration date         
const secret = process.env.SECRET as Secret
const expiration = '2h';


export default function authenicationMiddleware({ req, rep }: { req: RequestWithHeadersAuth, rep: Response }): Auth {
    return {
        authenticate: function({ username, email, id }) {
            const payload = { username, email, id };
            const token = jsonwebtoken.sign({ data: payload }, secret, {expiresIn: expiration});
            req.header.authorization = token;
            console.log(req.header.authorization)
            // return the token to the sign in resolver
            console.log(`${username} is being authiencated...`)
            return token;
        }, 
        verify: function(): UserPayload {
            console.log(req.header.authorization )
            // if the header is falsy then return a object with user and let
            // the me query error this auth error
            if( !req.header.authorization ) return { username: "No User Found", email: "No Email Found", id: "No ID was found"  }
            // decode the payload from the header
            console.log('hi')
            const token = req.header.authorization.split(' ').pop()?.trim() as string;
            const { data } = jsonwebtoken.verify(token, secret, { maxAge: expiration }) as { data: UserPayload }
            console.log(`${data.username} was verified...`)
            return { username: data.username, email: data.email, id: data.id }
        },
        endSession: function(): void {
            req.header.authorization = "";
        }
        
    }
}
