import { Document } from "mongoose";

export interface Auth {
    authenicate: Function
    verify: Function
    endSession: Function
}

export interface UserPayload {
    username: string
    email: string
    id: string
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
