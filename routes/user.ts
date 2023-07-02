import { Router } from "express";
import { User } from "../interface/user";
import executeSqlQuery from "../services/db-client";
import CryptoJs from "crypto-js";

const router = Router();

const users: User[] = [];

router.post("/register", async (req, res) => {
  const newUser: User = req.body;
  if (
    !newUser.name ||
    !newUser.surname ||
    !newUser.email ||
    !newUser.password ||
    !newUser.username
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const encryptedPassword = CryptoJs.SHA256(newUser.password).toString();

    const userCreationQuery = `INSERT INTO Users (name, surname, email, password, username) VALUES ('${newUser.name}', '${newUser.surname}', '${newUser.email}', '${encryptedPassword}', '${newUser.username}')`;

    await executeSqlQuery(userCreationQuery);

    res.status(200).json({ success: true, message: "User registered succesfully" });
  } catch (error) {
    res.status(409).json({ success: false, message: "User already exists" });
  }
});

// Endpoint para actualizar los datos de perfil de un usuario
router.put("/users/:username", (req, res) => {
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
