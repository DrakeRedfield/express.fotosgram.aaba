import Server from "./classes/server";
import userRoutes from "./routes/userRoutes";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postsRoutes from "./routes/postRoutes";
import fileUpload from "express-fileupload";
import cors from 'cors';

const server = new Server()
//BodyParse
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json());
//Config Upload File
server.app.use( fileUpload() );
//Config CORS
server.app.use( cors({origin: true, credentials: true}) );
//Routes of my app
server.app.use('/user',userRoutes);
server.app.use('/posts',postsRoutes);
//Connect DB
mongoose.connect('mongodb://localhost:27017/fotosgram',
    {useNewUrlParser: true, useCreateIndex: true}, error => {
        if(error) throw error;
        console.log('Base de datos Online')
});

server.start(()=>{
    console.log('Running on port 3000')
});