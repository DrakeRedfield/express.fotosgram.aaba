import { json } from "body-parser";
import { Request, Response, Router } from "express";
import FileSystem from "../classes/fileSystem";
import { IFileUpload } from "../interfaces/interface";
import { verifyToken } from "../middlewares/auth";
import { Post } from "../models/post";

const postsRoutes = Router();
const fileSystem = new FileSystem();
//Get all Post
postsRoutes.get('/',[verifyToken], async (req: any, res: Response) => {
    const page =  Number(req.query.page) || 1;
    const limit = 10;
    const skip = limit*(page-1)
    const allPosts = await Post.find()
                               .sort({ _id: -1 })
                               .skip( skip )
                               .limit(limit)
                               .populate('user','-password')
                               .exec();
    res.json({
        status: true,
        page: page,
        post: allPosts
    })
});
postsRoutes.post('/upload', [verifyToken], async (req: any, res: Response) =>{
    if( !req.files || !req.files.image ){
        res.status(400).json({
            status: false,
            message: 'File couldn\'t be uploaded'
        })
    }
    // const fileSystem = new FileSystem();
    const images: IFileUpload = req.files.image;
    if( !images.mimetype.includes('image') ){
        res.status(400).json({
            status: false,
            message: 'File must be an image'
        });
    }
    await fileSystem.saveImageTemp( images, req.user._id );
    res.json({
        status: true,
        message: 'File uploaded succesfuly.',
        // images
    });
});
//Get Image
postsRoutes.get('/image/:userid/:img', [verifyToken], (req:any, res: Response) =>{
    const userId = req.params.userid;
    const img = req.params.img;
    const pathImage = fileSystem.getImageUrl(userId, img);
    res.sendFile( pathImage );
});
//Create Post
postsRoutes.post('/create', [verifyToken], (req: any, res: Response) =>{
    const body = req.body;
    body.user = req.user._id;
    // const fileSystem = new FileSystem();
    body.imgs = fileSystem.moveImageToPost(req.user._id);
    Post.create(body).then( async postDB => {
        await postDB.populate('user','-password').execPopulate();
        return res.json({
            status: true,
            postDB
        })
    }).catch( err =>{
        res.json(err);
    });
    
});

export default postsRoutes;