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

// Endpoint para modificar un post existente
app.put('/users/:username/posts/:postId', (req: Request, res: Response) => {
  const { username, postId } = req.params;
  const { title, content } = req.body as Post;

  // Busca el post por su ID y usuario asociado
  const index = posts.findIndex(post => post.postId === postId && post.username === username);
  if (index !== -1) {
    // Si se encuentra el post, modifica sus propiedades
    posts[index].title = title;
    posts[index].content = content;

    const modifiedPost = posts[index];
    res.status(200).json({
      postId: modifiedPost.postId,
      title: modifiedPost.title,
      content: modifiedPost.content,
      userId: modifiedPost.username
    });
  } else {
    // Si el post no existe, devuelve el error 404
    res.status(404).json({
      errorCode: 'post_not_found',
      errorMessage: 'El post no existe'
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

