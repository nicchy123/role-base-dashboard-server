import { z } from "zod";

const loginValidationSchema = z.object({
  email: z.string({ required_error: "Id is required." }),
  password: z.string({ required_error: "Password is required" }),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string({
    required_error: "Old password is required",
  }),
  newPassword: z.string({ required_error: "Password is required" }),
});

const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required!",
  }),
});


const resetPasswordValidationSchema = z.object({

  newPassword: z.string({ required_error: `New password is required!` }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  resetPasswordValidationSchema,
};
