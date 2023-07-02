import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import { User } from "./interface/user";
import { Post } from "./interface/post";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const bodyParser= require('body-parser');
const cors= require('cors');
app.use(cors());
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/post',postRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
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

