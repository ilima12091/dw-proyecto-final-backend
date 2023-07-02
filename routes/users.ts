import { Router } from "express";
import { User } from "../interface/user";

const router = Router();

const users: User[] = [];

// Endpoint para actualizar los datos de perfil de un usuario
router.put("/:username", (req, res) => {
  const { username, name, surname, email, password } = req.body;

  // Busca el usuario por su nombre de usuario
  const user = users.find((user) => user.username === username);

  // Si el usuario existe, actualiza sus propiedades
  if (user) {
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
      name: user.name,
      surname: user.surname,
      email: user.email,
      userName: user.username,
    });
  } else {
    // Si el usuario no existe, devuelve el error 404
    res.status(404).json({
      errorCode: "user_not_found",
      errorMessage: "Usuario no existe",
    });
  }
});

export default router;