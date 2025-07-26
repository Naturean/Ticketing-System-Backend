import express from "express";
import { login } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.route("/auth").post(login);

export default authRouter;
