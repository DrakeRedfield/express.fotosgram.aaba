import { NextFunction, Request, Response }  from 'express'
import Token from '../classes/token';

export const verifyToken = (req: any, res:Response, next: NextFunction ) =>{
    const userToken = req.get('X-Token') || ''; //Get Header
    Token.verifyToken(userToken).then( (decoded:any) => {
        console.log(decoded,'********************************')
        req.user = decoded.user;//Add User in Request
        next();
    }).catch( error =>{
        res.json({
            status: false,
            message: 'Incorrect Token'
        })
    });
}