import { Router } from "express";
import { User } from "../interface/user";
import executeSqlQuery from "../services/db-client";
import { userData } from "../controllers/user.controllers";

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

router.get("/search", async (req, res) => {
  const { username } = req.query;

  const usersQuery = `SELECT * FROM users WHERE username LIKE '%${username}%'`;

  const usersResult = await executeSqlQuery(usersQuery);

  const responseData = usersResult.recordset.map(
    ({ user_id, username, profile_picture }) => ({
      user_id,
      username,
      profile_picture: profile_picture,
    })
  );
  res.json(responseData);
});

router.get("/user/:user_id", async (req, res) => {
    
    
  const user_id = Number(req.params.user_id);

  try {
    const user = await userData.getUserById(user_id);
    console.log('Retrieved user:', user);
  
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});  

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await userData.getUserByUsername(username);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

export default router;

