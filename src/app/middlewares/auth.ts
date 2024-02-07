import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config/config";
import { UserModel } from "../modules/user/user.model";
import {
  isJWTIssuedBeforePasswordChanged,
  verifyToken,
} from "../modules/auth/auth.utils";
import { TUserRole } from "../interfaces/app.types";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    const verifiedToken = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email, iat } = verifiedToken;

    // checking if the user is exist
    const user = await UserModel.findOne({email});

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    if (
      user.passwordChangedAt &&
      isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = verifiedToken;
    next();
  });
};

export default auth;
