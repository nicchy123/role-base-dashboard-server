import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { TImageObject } from "../interfaces/app.types";

export const sendImageToCloudinary = async (image: TImageObject) => {
  cloudinary.config({
    cloud_name: "dlvzn7ua6",
    api_key: "254845733229782",
    api_secret: "zx8f194tmrBGZlnL7a6J3sTQY5s",
  });

  return cloudinary.uploader.upload(
    `${image.path}`,
    { public_id: `${String(image.filename).split(".")[0]}` },
    function (error, result) {
      if (result?.secure_url) {
        fs.unlink(image.path as string, (error) => {
          if (error) {
            throw new AppError(
              httpStatus.NOT_MODIFIED,
              `Image deletion failed`
            );
          }
        });

        return result;
      }
    }
  );
};
