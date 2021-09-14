
export interface Auth {
    authenticate: ({ username, email, id } : { username: string, email: string, id: string }) => string
    verify: Function
    endSession: Function
}

export interface UserPayload {
    username: string
    email: string
    id: string
}


export interface RequestWithHeadersAuth extends Request {
    header: any
}