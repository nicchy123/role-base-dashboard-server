import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interfaces";
import {
  createHashedPassword,
  createToken,
  isJWTIssuedBeforePasswordChanged,
  isPasswordMatched,
  verifyToken,
} from "./auth.utils";
import config from "../../config/config";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await UserModel.findOne({ email: payload.email }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  //   // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  //   // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  //   //checking if the password is correct

  if (!(await isPasswordMatched(payload?.password, user?.password as string)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //   //create token and sent to the  client

  const jwtPayload = {
    email: user?.email as string,
    role: user?.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expiry as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expiry as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await UserModel.findById(userData.userId).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  //checking if the password is correct

  if (!(await isPasswordMatched(payload.oldPassword, user?.password as string)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await createHashedPassword(payload.newPassword);

  const result = await UserModel.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return result;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const verifiedToken = verifyToken(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { userId, iat } = verifiedToken;

  // checking if the user is exist
  const user = await UserModel.findOne({ _id: userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  if (
    user.passwordChangedAt &&
    isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    email: user.id as string,
    role: user.role as string,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expiry as string
  );

  return { accessToken };
};

const forgetPasswordLinkGenerate = async (id: string) => {
  // checking if the user is exist
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    email: user.id as string,
    role: user.role as string,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetLink = `https://localhost:3000?id=${id}&token=${resetToken}`;

  sendEmail(user.email, resetLink);
  return resetLink;
};

const resetPasswordIntoDB = async (
  payload: { userId: string; newPassword: string },
  token: string
) => {
  const user = await UserModel.findOne({ _id: payload?.userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const verifiedToken = verifyToken(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  const { role, userId } = verifiedToken;

  if (userId !== payload.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const newHashedPassword = await createHashedPassword(payload.newPassword);

  const result = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      role: role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return result;
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPasswordLinkGenerate,
  resetPasswordIntoDB,
};
