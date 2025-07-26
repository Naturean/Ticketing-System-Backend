import express from "express";
import { imgsUpload } from "../utils/fileUploadUtil.js";
import {
  createIssue,
  getIssue,
  updateIssue,
} from "../controller/issueController.js";

const issueRouter = express.Router();

issueRouter
  .route("/issue")
  .post(imgsUpload.any("imgs"), createIssue)
  .get(getIssue)
  .patch(updateIssue);

export default issueRouter;
