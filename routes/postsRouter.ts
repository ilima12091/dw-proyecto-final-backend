import { Router } from "express";
import executeSqlQuery from "../services/db-client";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const postQuery = `
    SELECT p.*, u.username, u.profile_picture,
      (SELECT comment_id, comment, u.username
        FROM Comments c
      INNER JOIN Users u
        ON u.user_id = c.user_id
        WHERE c.post_id = p.post_id
        FOR JSON PATH) AS comments
    FROM Posts AS p
    INNER JOIN Users AS u
      ON u.user_id = p.user_id
    WHERE p.post_id = ${id};`;

  const result = await executeSqlQuery(postQuery);

  res.json(result.recordset[0]);
});
export default router;
