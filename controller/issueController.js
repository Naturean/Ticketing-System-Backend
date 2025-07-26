import Issue from "../model/issue.js";
import Staff from "../model/staff.js";

import { convertTimestampToDateTime } from "../utils/dateUtil.js";
import { catchErrorAsync, AppError } from "../utils/errorUtil.js";
import { localImgUrl } from "../utils/envUtil.js";
import logger from "../utils/logger.js";

export const createIssue = catchErrorAsync(async (req, res, next) => {
  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(`[${createDate}] Creating issue...`);

  const { poster, description } = req.body;

  if (!poster || !description) {
    let message = "Fields missing:";

    if (!poster) message += " Poster";
    if (!description) message += " Description";

    return next(new AppError(message, 400));
  }

  let result = null;
  try {
    let image = null;
    if (req.files.length > 0) {
      image = [];
      req.files.forEach((file) => {
        const originalname = file.originalname;
        const curFilename = `${localImgUrl}/${req.questTime}-${originalname}`;

        image.push(curFilename);
      });
    }

    result = await Issue.create({
      poster,
      createDate,
      description,
      image: image ? JSON.stringify(image) : image,
      state: "wait",
      fixedDate: null,
      staffId: null,
    });
  } catch (error) {
    return next(error);
  }

  logger.info(
    `[${convertTimestampToDateTime(Date.now())}] Created issue successfully!`
  );

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getIssue = catchErrorAsync(async (req, res, next) => {
  const { id, staffId } = req.query;

  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(
    `[${createDate}] Getting issue ${id ? "with id " + id : "without id"}...`
  );

  // find all issues if id doesn't exists
  let result = null;
  if (id && staffId) {
    if (JSON.parse(id) instanceof Array) {
      const idArray = JSON.parse(id);

      try {
        result = await Issue.findAll({ where: { id: idArray, staffId } });
      } catch (error) {
        return next(new AppError(error.name, 500));
      }

      if (!result) {
        return next(
          new AppError(`Issues ${id} of staff ${staffId} are not existed!`, 404)
        );
      }

      logger.info(
        `[${convertTimestampToDateTime(
          Date.now()
        )}] Got issues ${id} of staff ${staffId} successfully!`
      );

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } else {
      try {
        result = await Issue.findOne({ where: { id, staffId } });
      } catch (error) {
        return next(new AppError(error.name, 500));
      }

      if (!result) {
        return next(
          new AppError(`Issue ${id} of staff ${staffId} is not existed!`, 404)
        );
      }

      logger.info(
        `[${convertTimestampToDateTime(
          Date.now()
        )}] Got issue ${id} of staff ${staffId} successfully!`
      );

      return res.status(200).json({
        status: "success",
        data: result,
      });
    }
  } else if (staffId) {
    try {
      result = await Issue.findAll({ where: { staffId } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (result.length === 0) {
      return next(
        new AppError(`Issues of staff ${staffId} are not existed!`, 404)
      );
    }

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Got issues by staffId successfully!`
    );

    return res.status(200).json({
      status: "success",
      length: result.length,
      data: result,
    });
  } else if (!id) {
    try {
      result = await Issue.findAll();
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    logger.info(
      `[${convertTimestampToDateTime(Date.now())}] Got issues successfully!`
    );

    return res.status(200).json({
      status: "success",
      length: result.length,
      data: result,
    });
  } else if (JSON.parse(id) instanceof Array) {
    const idArray = JSON.parse(id);

    try {
      result = await Issue.findAll({ where: { id: idArray } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!result) {
      return next(new AppError(`Issues ${id} are not existed!`, 404));
    }

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Got issues ${id} successfully!`
    );

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } else {
    try {
      result = await Issue.findOne({ where: { id } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!result) {
      return next(new AppError(`Issue ${id} is not existed!`, 404));
    }

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Got issue ${id} successfully!`
    );

    return res.status(200).json({
      status: "success",
      data: result,
    });
  }
});

export const updateIssue = catchErrorAsync(async (req, res, next) => {
  const { id, staffId, adminId = 0 } = req.body;

  const createDate = convertTimestampToDateTime(req.questTime);
  logger.info(`[${createDate}] Updating issue${id ? " with id " + id : ""}...`);

  if (!id || !staffId) {
    return next(new AppError("Missing fields", 400));
  }

  let issue = null;

  try {
    issue = await Issue.findOne({ where: { id: id } });
  } catch (error) {
    return next(new AppError(error.name, 500));
  }

  if (!issue) {
    return next(new AppError(`Issue ${id} is not existed!`, 404));
  }

  const { state: issueState, staffId: issueStaffId } = issue.dataValues;
  if (issueState === "complete") {
    return next(new AppError("Completed issues are immutable", 422));
  }

  let staff = null;
  let staffRole = null;

  if (adminId !== 0) {
    try {
      staff = await Staff.findOne({ where: { id: adminId } });
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!staff) {
      return next(new AppError(`Admin ${adminId} not found`, 404));
    }

    staffRole = staff.dataValues.staffRole;
  }

  if (staff && staffRole === "admin") {
    if (issueState !== "wait") {
      return next(new AppError("Issue was already being fixing", 422));
    }

    let updatedData = null;
    try {
      updatedData = await Issue.update(
        { state: "fixing", staffId: staffId },
        { where: { id: id } }
      );
    } catch (error) {
      return next(new AppError(error.name, 500));
    }

    if (!updatedData) {
      return next(new AppError("Updated issue data is undefined or null", 500));
    }

    logger.info(
      `[${convertTimestampToDateTime(
        Date.now()
      )}] Updated issue ${id} successfully! Current status: fixing.`
    );

    return res.status(200).json({
      status: "success",
      data: updatedData,
    });
  }

  if (issueState !== "fixing" || issueStaffId !== Number(staffId)) {
    const message =
      issueState !== "fixing"
        ? "cannot complete the issue not fixing"
        : "mismatch the staff id";

    return next(new AppError(message, 422));
  }

  const fixedDate = convertTimestampToDateTime(req.questTime);
  let updatedData = null;
  try {
    updatedData = await Issue.update(
      { state: "complete", fixedDate: fixedDate },
      { where: { id: id } }
    );
  } catch (error) {
    return next(new AppError(error.name, 500));
  }

  if (!updatedData) {
    return next(new AppError("Updated issue data is undefined or null", 500));
  }

  logger.info(
    `[${convertTimestampToDateTime(
      Date.now()
    )}] Updated issue ${id} successfully! Current status: complete.`
  );

  return res.status(200).json({
    status: "success",
    data: updatedData,
  });
});
