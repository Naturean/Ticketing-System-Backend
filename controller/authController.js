import { convertTimestampToDateTime } from "../utils/dateUtil.js";
import { AppError, catchErrorAsync } from "../utils/errorUtil.js";
import logger from "../utils/logger.js";
import Staff from "../model/staff.js";

export const login = catchErrorAsync(async (req, res, next) => {
  console.log(req.body);
  const { accountName, password } = req.body;

  // TODO: Encapsulate logger function
  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(
    `[${createDate}] Trying to login. Account Name: ${
      accountName ? accountName : ""
    }, Password: ${password ? password : ""}`
  );

  if (!accountName || !password) {
    return next(new AppError("Missing field", 400));
  }

  let result = null;

  try {
    result = await Staff.findOne({ where: { accountName } });
  } catch (error) {
    return next(new AppError(error.name, 500));
  }

  if (!result) {
    return next(new AppError(`Account ${accountName} is not existed!`, 404));
  }

  if (result.dataValues.password !== password) {
    return next(new AppError(`Password doesn't match!`, 401));
  }

  const { password: _, ...rest } = result.dataValues;
  const resultWithoutPassword = rest;

  logger.info(
    `[${convertTimestampToDateTime(Date.now())}] Logged in successfully!`
  );

  return res.status(200).json({
    status: "success",
    data: resultWithoutPassword,
  });
});
