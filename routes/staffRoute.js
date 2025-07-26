import express from "express";
import {
  createStaff,
  getStaff,
  updateStaff,
} from "../controller/staffController.js";
import { avatarUpload } from "../utils/fileUploadUtil.js";

const staffRouter = express.Router();

staffRouter
  .route("/staff")
  .post(createStaff)
  .get(getStaff)
  .patch(avatarUpload.any("avatar"), updateStaff);

export default staffRouter;
