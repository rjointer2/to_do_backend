

export interface Auth {
    authenicate: Function
    verify: Function
    endSession: Function
}

export interface UserPayload {
    username: string
    email: string
    [id: string]: any
}

export interface TodoObject {
    id: string
    completed: boolean
    likedBy: string 
    subject: string
    todo: string
    createdBy: string
    dueDate: string
    didUserLike: string
    comments: string
}

export interface CommentObject {
    id: string
    createdBy: UserObject
    comment: string
    todo: TodoObject
    createdAt: string
}

export interface UserObject {
    id: string 
    email: string 
    username: string
    todos: any 
    comments: CommentObject
    friends: UserObject 
}
