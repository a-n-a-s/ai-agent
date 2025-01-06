import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./db/db.js";

import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";

connect();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/project", projectRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

export default app;
