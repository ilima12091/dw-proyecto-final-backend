import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserLogin } from "../interfaces/user-login";

export const login: RequestHandler = (req, res) => {
  const user: UserLogin = req.body;

  if (!user.email || !user.password) return res.status(400).send("Bad request");
  // TODO: Validate user credentials

  const token = jwt.sign({}, process.env.JWT_SECRET as string, {
    expiresIn: `${process.env.TOKEN_EXPIRATION ?? 3600000}ms`,
  });

  res.cookie("SESSION", token, {
    httpOnly: true,
    secure: true,
    maxAge: (process.env.TOKEN_EXPIRATION ?? 3600000) as number,
  });

  res.status(200).send({
    sessionExpiration: Date.now() + ((process.env.TOKEN_EXPIRATION ?? 3600000) as number),
  });
};
