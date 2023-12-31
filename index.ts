import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import session from "./routes/session";
import users from "./routes/users";
import posts from "./routes/posts";
import postsRouter from "./routes/postsRouter";
import validateSession from "./middlewares/session";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes without token validation
app.use("/session", session);

// Token validation middleware
app.use(validateSession);

// Routes with token validation
app.use("/users", users);
app.use("/users", posts);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
