import { convertTimestampToDateTime } from "../utils/dateUtil.js";
import { AppError, catchErrorAsync } from "../utils/errorUtil.js";
import { getEnvironmentVariable } from "../utils/envUtil.js";

import Staff from "../model/staff.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

const { publicAvatarUrl } = getEnvironmentVariable();

export const createStaff = catchErrorAsync(async (req, res, next) => {
  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(`[${createDate}] Creating staff...`);

  const { staffName, accountName, password } = req.body;

  if (!staffName || !password) {
    return next(new AppError("Missing fields", 400));
  }

  let result = null;
  try {
    result = await Staff.create({
      staffName,
      staffRole: "staff",
      accountName,
      password,
      avatarUrl: `${publicAvatarUrl}/default_avatar.png`,
    });
  } catch (error) {
    return next(new AppError(error.name, 500));
  }

  logger.info(
    `[${convertTimestampToDateTime(Date.now())}] Created staff successfully!`
  );

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

export const getStaff = catchErrorAsync(async (req, res, next) => {
  const { id } = req.query;

  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(
    `[${createDate}] Getting staff ${id ? "with id " + id : "without id"}...`
  );

  let result = null;
  // All staffs
  if (!id) {
    try {
      result = await Staff.findAll();
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    // remove password information
    const resultWithoutPassword = result.map((r) => {
      const { password, ...rest } = r.dataValues;
      return rest;
    });

    logger.info(
      `[${convertTimestampToDateTime(Date.now())}] Got staffs successfully!`
    );

    return res.status(200).json({
      status: "success",
      length: resultWithoutPassword.length,
      data: resultWithoutPassword,
    });
  } else if (JSON.parse(id) instanceof Array) {
    const idArray = JSON.parse(id);

    try {
      result = await Staff.findAll({ where: { id: idArray } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!result) {
      return next(new AppError(`Staffs ${id} is not existed!`, 404));
    }

    const resultWithoutPassword = result.map((r) => {
      const { password, ...rest } = r.dataValues;
      return rest;
    });

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Got staffs ${id} successfully!`
    );

    return res.status(200).json({
      status: "success",
      data: resultWithoutPassword,
    });
  } else {
    try {
      result = await Staff.findOne({ where: { id } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!result) {
      return next(new AppError(`Staff ${id} is not existed!`, 404));
    }

    // remove password information
    const { password, ...rest } = result.dataValues;
    const resultWithoutPassword = rest;

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Got staff ${id} successfully!`
    );

    return res.status(200).json({
      status: "success",
      data: resultWithoutPassword,
    });
  }
});

export const updateStaff = catchErrorAsync(async (req, res, next) => {
  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(`[${createDate}] Updating staff...`);

  const { id, accountName, password } = req.body;

  let updatedData = null;
  try {
    let avatarUrl = null;
    if (req.files.length > 0) {
      const extName = req.files[0].originalname.split(".").at(-1);
      avatarUrl = `${publicAvatarUrl}/${req.questTime}-${id}.${extName}`;
    }

    const updateFields = {};

    let oldData = null;
    try {
      oldData = await Staff.findOne({ where: { id: id } });
      if (!oldData) {
        return next(new AppError(`No matched staff: id ${id}`, 404));
      }
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (
      accountName &&
      accountName !== "" &&
      oldData.dataValues.accountName !== accountName
    ) {
      try {
        const sameNameData = await Staff.findOne({
          where: {
            accountName,
            [Op.not]: { id: id },
          },
        });
        if (sameNameData) {
          return next(new AppError("Account name has been occupied", 406));
        }
      } catch (error) {
        return next(new AppError(error.name, 500));
      }

      updateFields.accountName = accountName;
    }

    if (password && password !== "" && oldData.password !== password) {
      updateFields.password = password;
    }

    if (avatarUrl) {
      updateFields.avatarUrl = avatarUrl;
    }

    if (Object.keys(updateFields).length > 0) {
      updatedData = await Staff.update(updateFields, {
        where: { id: id },
      });
    } else {
      return next(new AppError("No fields to be updated", 400));
    }
  } catch (error) {
    return next(new AppError(error.name, 500));
  }

  if (!updatedData) {
    return next(new AppError("Updated staff data is undefined or null", 500));
  }

  logger.info(
    `[${convertTimestampToDateTime(
      Date.now()
    )}] Updated staff ${id} successfully!`
  );

  return res.status(201).json({
    status: "success",
    data: updatedData,
  });
});
