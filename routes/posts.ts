import { Router } from "express";
import executeSqlQuery from "../services/db-client";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/posts/feed", async (req, res) => {
  const sessionCookie = req.cookies.SESSION;

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  const postsQuery = `SELECT p.post_id, p.user_id, p.content, p.timestamp, u2.profile_picture, u2.username
    FROM Users AS u 
    INNER JOIN Follows AS f 
      ON u.user_id = f.follower_id
    INNER JOIN Users AS u2
      ON f.followed_id = u2.user_id
    INNER JOIN Posts AS p
      ON u2.user_id = p.user_id
    WHERE u.user_id = ${decodedToken.user_id}
    ORDER BY p.timestamp DESC
    `;
  const postsResult = await executeSqlQuery(postsQuery);

  res.json(postsResult.recordset);
});

export default router;
