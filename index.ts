import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import { User } from "./interface/user";
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


// Endpoint para actualizar los datos de perfil de un usuario
app.put('/users/:username', (req: Request, res: Response) => {
  const { username } = req.params;
  const { name, surname, email, password } = req.body as User;


  // la lista de usuarios esta en routes, no pude traerla

  // Busca el usuario por su nombre de usuario
  const user = users.find(user => user.username === username);

  if (user) {
    // Si el usuario existe, actualiza sus propiedades
    if (name) {
      user.name = name;
    }
    if (surname) {
      user.surname = surname;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    if (username) {
      user.username = username;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      userName: user.username,
      profilePicture: user.profilePicture
    });
  } else {
    // Si el usuario no existe, devuelve el error 404
    res.status(404).json({
      errorCode: 'user_not_found',
      errorMessage: 'Usuario no existe'
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

