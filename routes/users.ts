import { Router } from "express";
import { User } from "../interface/user";
import executeSqlQuery from "../services/db-client";

const router = Router();

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, surname, username } = req.body;

  const userUpdateQuery = `UPDATE Users SET ${name && `name = '${name}',`} ${
    surname && `surname = '${surname}',`
  } ${username && `username = '${username}'`} WHERE user_id = ${id};`;

  try {
    await executeSqlQuery(userUpdateQuery);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      errorCode: "internal_server_error",
      errorMessage: "Internal error",
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const userQuery = `SELECT * FROM users WHERE user_id = ${id}`;

  const userResult = await executeSqlQuery(userQuery);

  if (userResult.recordset.length === 0) {
    res.status(404).json({
      errorCode: "user_not_found",
      errorMessage: "Usuario no existe",
    });
  }

  const { name, surname, email, username, profile_picture } = userResult.recordset[0];

  const responseData = {
    name,
    surname,
    email,
    username,
    profile_picture,
  };

  res.json(responseData);
});

export default router;
