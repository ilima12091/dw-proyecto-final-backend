import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
