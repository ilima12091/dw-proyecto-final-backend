import { Router } from "express";
import executeSqlQuery from "../services/db-client";
import jwt from "jsonwebtoken";

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

  const sessionCookie = req.cookies.SESSION;

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  const usersQuery = `SELECT u.*, 
    CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END AS following
    FROM users u
    LEFT JOIN Follows f ON f.followed_id = u.user_id AND f.follower_id = ${decodedToken.user_id}
    WHERE u.username LIKE '%${username}%' AND u.user_id != ${decodedToken.user_id};`;

  const usersResult = await executeSqlQuery(usersQuery);

  const responseData = usersResult.recordset.map(
    ({ user_id, username, profile_picture, following }) => ({
      user_id,
      username,
      profile_picture,
      following,
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

router.post("/follow", async (req, res) => {
  const { followedId } = req.body;

  const sessionCookie = req.cookies.SESSION;

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  const insertFollowQuery = `INSERT INTO Follows (follower_id, followed_id) VALUES (${decodedToken.user_id}, ${followedId})`;

  await executeSqlQuery(insertFollowQuery);

  res.json({ message: "Followed successfully" });
});

router.post("/unfollow", async (req, res) => {
  const { followedId } = req.body;

  const sessionCookie = req.cookies.SESSION;

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  const deleteFollowQuery = `DELETE FROM Follows WHERE follower_id = ${decodedToken.user_id} AND followed_id = ${followedId}`;

  await executeSqlQuery(deleteFollowQuery);

  res.json({ message: "Unfollowed successfully" });
});

export default router;
