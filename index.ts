//node init iniciar una aplicación de node
//dist: Carpeta que contiene los js generados de ts, definida en tsconfig
//tsc -w observa los cambios en el ts y los transforma a js en la carpeta dist
import Server from "./classes/server";
import userRoutes from "./routes/userRoutes";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postsRoutes from "./routes/postRoutes";

const server = new Server()
//Body Parse
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json());
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