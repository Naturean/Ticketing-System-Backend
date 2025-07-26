import { convertTimestampToDateTime } from "../utils/dateUtil.js";
import { getEnvironmentVariable } from "../utils/envUtil.js";
import logger from "../utils/logger.js";

const { environment } = getEnvironmentVariable();

const sendProductionError = (err, res) => {
  if (err.message === "SequelizeDatabaseError") {
    return res.status(500).json({
      status: "failed",
      message: "Error occur during the database operation",
    });
  }

  if (err.statusCode === 400) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }

  if (err.statusCode === 404) {
    return res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

export const globalErrorHandler = (err, req, res, _next) => {
  const createDate = convertTimestampToDateTime(req.questTime);
  logger.error(`[${createDate}] Error in global error handler: ${err.message}`);

  if (environment === "production") {
    return sendProductionError(err, res);
  }

  if (err.isCustom) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "failed",
    message: "Internal Server Error",
  });
};
