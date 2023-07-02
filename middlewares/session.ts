import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const validateSession = (req: Request, res: Response, next: NextFunction) => {
  const handleUnauthorized = () => {
    res.clearCookie("SESSION");
    return res
      .status(401)
      .send({ errorCode: "unauthorized", errorMessage: "Unauthorized" });
  };

  const sessionCookie = req.cookies.SESSION;

  if (!sessionCookie) return handleUnauthorized();

  const decodedToken: any = jwt.verify(sessionCookie, process.env.JWT_SECRET as string);

  if (Date.now() >= decodedToken.exp * 1000) return handleUnauthorized();

  next();
};

export default validateSession;
