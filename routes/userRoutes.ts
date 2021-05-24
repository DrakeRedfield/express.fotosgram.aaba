import { Request, Response, Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { IUser } from '../interfaces/interface';
import Token from '../classes/token';
import { verifyToken } from "../middlewares/auth";

const userRoutes = Router();

userRoutes.post( '/login', (req: Request, res: Response) => {
    const body = req.body;
    User.findOne({ email:body.email }, async (err:Error, userDB: IUser) => {
        if(err) throw err;
        if( !userDB ){
            return res.json({
                status: false,
                message: 'Usuario o Contraseña incorrecta.'
            })
        }
        // console.log()
        const passverf = await userDB.verifyPass(body.password)
        if( passverf ){
            const userToken = Token.getJwtToken({
                _id: userDB._id,
                email: userDB.email,
                nombre: userDB.nombre,
                avatar: userDB.avatar
            })
            return res.json({
                status: true,
                token: userToken
            })
        }else{
            return res.json({
                status: false,
                token: 'Usuario o Contraseña incorrecta.'
            })
        }
    });
});
userRoutes.post( '/update', verifyToken ,(req:any, res:Response) =>{
    const user = {
        nombre: req.body.nombre || req.user.nombre,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar
    }
    console.log(req.user)
    console.log(user)
    User.findByIdAndUpdate( req.user._id, user, { new: true }, (err, userDB) => {
        if(err) throw err;
        if( !userDB ){
            return res.json({
                status: false,
                message: 'Usuario no encontrado'
            });
        }
        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            status: true,
            token: userToken
        })
    });
});
userRoutes.post( '/create', ( req:Request, res:Response ) =>{
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync( req.body.password, 10),
        avatar: req.body.avatar
    }
    User.create( user ).then( userDB => {
        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar
        })

        return res.json({
            status: true,
            token: userToken
        })
        res.json({
            status:true,
            userDB
        })
    }).catch( err => {
        res.json({
            status:false,
            err
        })
    });
});

export default userRoutes;