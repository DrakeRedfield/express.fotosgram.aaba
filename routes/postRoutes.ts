import { json } from "body-parser";
import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/auth";
import { Post } from "../models/post";

const postsRoutes = Router();

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
postsRoutes.post('/create', [verifyToken], (req: any, res: Response) =>{
    const body = req.body;
    body.user = req.user._id;
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