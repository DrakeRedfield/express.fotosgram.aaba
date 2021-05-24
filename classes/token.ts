import jwt from 'jsonwebtoken';

export default class Token{
    private static seed: string = 'temporal-seed-sign-token';
    private static expireDays: string = '30d';
    
    constructor(){}

    static getJwtToken( payload: any ): string{
        return jwt.sign({
            user: payload
        }, this.seed, {expiresIn: this.expireDays})
    }

    static verifyToken(  userToken: string ){
        return new Promise( (resolve,reject) =>{
            jwt.verify( userToken, this.seed, (err, decoded) =>{
                if( err ) reject();
                else resolve(decoded);
            });
        })
    }
}