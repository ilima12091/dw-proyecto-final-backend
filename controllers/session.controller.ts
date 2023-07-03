import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserLogin } from "../interfaces/user-login";
import executeSqlQuery from "../services/db-client";
import CryptoJs from "crypto-js";
import { User } from "../interface/user";

export const login: RequestHandler = async (req, res) => {
  const user: UserLogin = req.body;

  if (!user.email || !user.password)
    return res.status(400).send({
      errorCode: "request-body-error",
      errorMessage: "Bad request",
    });

  const encryptedPassword = CryptoJs.SHA256(user.password).toString();

  const userFromDbResult = await executeSqlQuery(
    `SELECT * FROM Users WHERE email = '${user.email}' AND password = '${encryptedPassword}'`
  );

  if (userFromDbResult?.recordset.length === 0)
    return res.status(401).send({
      errorCode: "unauthorized",
      errorMessage: "Unauthorized",
    });

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
    userId: userData.user_id,
  });
};

export const register: RequestHandler = async (req, res) => {
  const newUser: User = req.body;
  if (
    !newUser.name ||
    !newUser.surname ||
    !newUser.email ||
    !newUser.password ||
    !newUser.username
  ) {
    return res.status(400).json({
      errorCode: "request-body-error",
      errorMessage: "All fields are required",
    });
  }

  try {
    const encryptedPassword = CryptoJs.SHA256(newUser.password).toString();

    const userCreationQuery = `INSERT INTO Users (name, surname, email, password, username) VALUES ('${newUser.name}', '${newUser.surname}', '${newUser.email}', '${encryptedPassword}', '${newUser.username}')`;

    await executeSqlQuery(userCreationQuery);

    res.status(200).json({ success: true, message: "User registered succesfully" });
  } catch (error) {
    res
      .status(409)
      .json({ errorCode: "user-already-exists", errorMessage: "User already exists" });
  }
};

export const logout: RequestHandler = async (req, res) => {
  const sessionCookie = req.cookies.SESSION;

  if (!sessionCookie)
    return res.send({
      message: "Successfully logged out",
    });

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  const sessionDeletionQuery = `DELETE FROM Sessions WHERE session_id = ${decodedToken.session_id}`;

  await executeSqlQuery(sessionDeletionQuery);

  res.clearCookie("SESSION");

  res.status(200).send({ success: true, message: "User logged out succesfully" });
};
