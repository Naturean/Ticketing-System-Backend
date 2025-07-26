import express from "express";
import morgan from "morgan";
import cors from "cors";

import issueRouter from "./routes/issueRoute.js";
import staffRouter from "./routes/staffRoute.js";
import { globalErrorHandler } from "./controller/errorController.js";
import { apiRoute } from "./utils/envUtil.js";
import authRouter from "./routes/authRoute.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.questTime = Date.now();
  next();
});

app.use(apiRoute, issueRouter);
app.use(apiRoute, staffRouter);
app.use(apiRoute, authRouter);
app.use((req, res) => {
  return res.status(404).json({
    status: "failed",
    message: `404 Not Found: ${req.originalUrl}`,
  });
});

app.use(globalErrorHandler);

export default app;
