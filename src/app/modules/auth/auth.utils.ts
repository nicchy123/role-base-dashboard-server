import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, `You are unauthorized!`);
  }
};

export const isPasswordMatched = async (
  plainPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export const createHashedPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, Number(config.bcrypt_salt));
};

export const isJWTIssuedBeforePasswordChanged = (
  passwordChangedAt: Date,
  tokenIssuedAt: number
) => {
  return new Date(passwordChangedAt).getTime() / 1000 > tokenIssuedAt;
};
