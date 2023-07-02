import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserLogin } from "../interfaces/user-login";
import executeSqlQuery from "../services/db-client";
import CryptoJs from "crypto-js";

export const login: RequestHandler = async (req, res) => {
  const user: UserLogin = req.body;

  if (!user.email || !user.password) return res.status(400).send("Bad request");
  // TODO: Validate user credentials

  const encryptedPassword = CryptoJs.SHA256(user.password).toString();

  const userFromDbResult = await executeSqlQuery(
    `SELECT * FROM Users WHERE email = '${user.email}' AND password = '${encryptedPassword}'`
  );

  if (userFromDbResult?.recordset.length === 0)
    return res.status(401).send("Unauthorized");

  const userData = userFromDbResult.recordset[0];

  const expirationDate = Date.now() + parseInt(process.env.TOKEN_EXPIRATION ?? "3600000");

  const sessionCreationQuery = `INSERT INTO Sessions (user_id, expiration_date) VALUES (${userData.user_id}, '${expirationDate}'); SELECT SCOPE_IDENTITY() AS new_id`;

  const sessionCreationResult = await executeSqlQuery(sessionCreationQuery);

  const token = jwt.sign(
    {
      user_id: userData.user_id,
      session_id: sessionCreationResult.recordset[0].new_id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: `${process.env.TOKEN_EXPIRATION ?? 3600000}ms`,
    }
  );

  res.cookie("SESSION", token, {
    httpOnly: true,
    secure: true,
    maxAge: (process.env.TOKEN_EXPIRATION ?? 3600000) as number,
  });

  res.status(200).send({
    sessionExpiration: Date.now() + ((process.env.TOKEN_EXPIRATION ?? 3600000) as number),
  });
};
