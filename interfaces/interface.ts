import { Document } from "mongoose";

export interface IUser extends Document {
    nombre: string,
    avatar: string,
    email: string,
    password: string,
    verifyPass(password: string): boolean,
}

export interface IPost extends Document {
    created: Date,
    message: string,
    img: string[],
    coords: string,
    user: string
}