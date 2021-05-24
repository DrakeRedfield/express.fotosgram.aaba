import { model, Schema } from 'mongoose';
import { IUser } from '../interfaces/interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    nombre:{
        type: String,
        require: [true,'The name cannot be']
    },
    avatar:{
        type: String,
        default: 'default_avatar.png'
    },
    email:{
        type: String,
        unique: true,
        require: [true,'Email is require']
    },
    password:{
        type: String,
        require: [true, 'Password cannot be empty']
    }
});

userSchema.method('verifyPass', async function( password: string = '' ){
    const temp = await bcrypt.compare(password, this.password)
    if( temp ){
        return true
    } 
    else{
        return false;
    }
})

export const User = model<IUser>('User',userSchema);