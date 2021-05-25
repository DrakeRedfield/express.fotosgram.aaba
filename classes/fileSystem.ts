import { IFileUpload } from '../interfaces/interface';
import uniqid from 'uniqid';
import path from 'path';
import fs from 'fs';

export default class FileSystem {
    constructor(){}
    saveImageTemp( file:IFileUpload, idUser: string ){
        return new Promise( (resolve,reject) => {
            //Check Exist Folder
            const path = this.createFolder( idUser );
            //Generate Unique Id
            const newNameFile = this.generateUniqueId( file.name );
            console.log('New Name File', newNameFile);
            file.mv(`${path}/${newNameFile}`, (err:any) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(true);
                }
            });
        })
    }
    moveImageToPost( userId:string ): string[]{
        const tempPath = path.resolve( __dirname,'../uploads', userId, 'temp' );
        const postsPath = path.resolve( __dirname,'../uploads', userId, 'posts' );
        if( !fs.existsSync(tempPath) ){
            return [];
        }
        if( !fs.existsSync( postsPath ) ){
            fs.mkdirSync( postsPath );
        }
        const imagesInTemp = this.getImagesFromTemp( userId );
        imagesInTemp.forEach( image =>{
            fs.renameSync(`${tempPath}/${image}`,`${postsPath}/${image}`);
        });
        return imagesInTemp;
    }
    getImageUrl( userId:string, image: string ){
        const pathImage = path.resolve( __dirname,'../uploads',userId,'posts',image);
        if( !fs.existsSync(pathImage) ){
            return path.resolve( __dirname,'../assets/400x250.jpg')
        }
        return pathImage;
    }
    private getImagesFromTemp( userId:string ){
        const tempPath = path.resolve( __dirname,'../uploads', userId, 'temp' );
        return fs.readdirSync(tempPath) || [];
    }
    private generateUniqueId( fileName: string ){
        const arrName = fileName.split('.');
        const extFile = arrName[ arrName.length - 1 ];
        const uniqueId = uniqid();
        return `${uniqueId}.${extFile}`
    }
    private createFolder( userId: string ){
        const userPath = path.resolve( __dirname,'../uploads', userId );
        const tempPath = path.resolve( userPath, 'temp' );
        const existPath = fs.existsSync(userPath);
        if( !existPath ){
            fs.mkdirSync(userPath);
            fs.mkdirSync(tempPath);
        }
        return tempPath;
    }
}