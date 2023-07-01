import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const bodyParser= require('body-parser');
const cors= require('cors');

const app: Express = express();
app.use(cors());
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post('/register',(req,res)=>{
  const{name,surname,email,password,username}=req.body;

  res.status(200).json({success:true,message:'User registered succesfully'});
  console.log(req.body); //just to try and see if it works
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

