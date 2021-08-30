
export interface Auth {
    authenicate: ({ username, email, id } : { username: string, email: string, id: string }) => string
    verify: Function
    endSession: Function
}

export interface UserPayload {
    username: string
    email: string
    id: string
}


export interface TodoObject {
    [id: string]: any 
    completed: boolean
    likedBy: UserObject 
    subject: string
    todo: string
    createdBy: string
    dueDate: string
    didUserLike: string
    comments: CommentObject
}

export interface CommentObject {
    id: string
    createdBy: UserObject
    comment: string
    todo: TodoObject
    createdAt: string
}

export interface UserObject {
    [id: string]: any 
    email: string 
    username: string
    todos: any 
    comments: CommentObject
    friends: UserObject 
}
