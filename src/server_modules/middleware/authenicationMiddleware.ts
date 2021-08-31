
import dotenv from 'dotenv';
import { Response, Request } from 'express';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import { Auth, UserPayload } from '../type';


dotenv.config();

// set token secret and expiration date         
const secret                                    = process.env.SECRET;
const expiration                                = '2h';


export default function authenicationMiddleware({ req, rep }: { req: Request, rep: Response }): Auth {
    return {
        authenticate: function({ username, email, id }) {
            const payload = { username, email, id };
            const token = jsonwebtoken.sign({ data: payload }, secret as string, {expiresIn: expiration});
            req.headers.authorization = token;
            // return the token to the sign in resolver
            return token;
        }, 
        verify: function(): UserPayload {
            // if the header is falsy then return a object with user and let
            // the me query error this auth error
            if( !req.headers.authorization ) return { username: "No User Found", email: "No Email Found", id: "No ID was found"  }
            // decode the payload from the header
            const token = req.headers.authorization.split(' ').pop()?.trim();
            const { data } = jsonwebtoken.verify(token as string, secret as string, { maxAge: expiration }) as { data: UserPayload }
            return { username: data.username, email: data.email, id: data.id }
        },
        endSession: function(): void {
            req.headers.authorization = "";
        }
        
    }
}
