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

export interface IFileUpload{
    name: string,
    data: any,
    encoding: string,
    size?: number,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,
    md5?: string,
    mv: Function
}