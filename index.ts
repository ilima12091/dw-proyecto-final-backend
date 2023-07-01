import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import { Post } from "./interface/post";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const bodyParser= require('body-parser');
const cors= require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use('/user',userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


// Array para almacenar los posts (simulación de una base de datos)
const posts: Post[] = [];

// Nuevo endpoint para crear un nuevo post
app.post('/users/:userId/posts', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { title, content } = req.body as Post;

  //
  //
  // la lógica para crear un nuevo post
  //
  //

  if (userId) {
    // Si el usuario está autenticado, crea el nuevo post
    const postId = String(posts.length + 1); // ID del nuevo post creado
    const post: Post = { postId, title, content };
    posts.push(post);
    res.status(200).json(post);
  } else {
    // Si el usuario no está autenticado, devuelve el error 401
    res.status(401).json({
      errorCode: 'unauthenticated',
      errorMessage: 'Usuario no autenticado'
    });
  }
});




/*
  app.post('/register',(req,res)=>{
  const{name,surname,email,password,username}=req.body;

  res.status(200).json({success:true,message:'User registered succesfully'});
  console.log(req.body); //just to try and see if it works
})
 
 */


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

