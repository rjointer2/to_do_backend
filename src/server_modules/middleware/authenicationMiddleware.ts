
import dotenv from 'dotenv';
import { Response, Request } from 'express';

interface UserPaylaod {
    username: string
}


dotenv.config();

// set token secret and expiration date         
const secret                                    = process.env.SECRET;
const expiration                                = '2h';


export default function authenicationMiddleware({ req, rep }: { req: Request, rep: Response }): Auth {
    return {
        authenicate: function({ username } : UserPayload): UserPayload {
            return { username }
        }, 
        verify: function () {
            
        }
    }
}
