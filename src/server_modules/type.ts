
interface Auth {
    authenicate: Function
    verify: Function
    endSession: Function
}

interface UserPayload {
    username: string
    email: string
    id: string
}


