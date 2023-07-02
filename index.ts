import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import login from "./routes/login";

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

app.use("/login", login);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
