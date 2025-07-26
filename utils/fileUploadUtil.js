import multer from "multer";

const imgsStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "./public/imgs");
  },
  filename(req, file, cb) {
    const originalname = file.originalname;

    cb(null, `${req.questTime}-${originalname}`);
  },
});

const avatarStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "./public/avatar");
  },
  filename(req, file, cb) {
    const extName = file.originalname.split(".").at(-1);
    const { id } = req.body;

    cb(null, `${req.questTime}-${id}.${extName}`);
  },
});

export const imgsUpload = multer({ storage: imgsStorage });
export const avatarUpload = multer({ storage: avatarStorage });
