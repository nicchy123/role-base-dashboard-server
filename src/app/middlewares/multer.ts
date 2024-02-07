import path from "path";
import multer from "multer";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/uploads/`);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename =
      file.originalname.replace(ext, "").split(" ").join("-") +
      `-${Date.now()}`;
    cb(null, filename + ext);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    const allowedType = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(httpStatus.BAD_REQUEST, `Invalid image type`));
    }
  },
});

