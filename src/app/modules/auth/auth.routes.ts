import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controllers";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../interfaces/app.types";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.get(
  "/forget-password",
  auth("admin", "user"),
  AuthControllers.forgetPassword
);

router.post(
  "/reset-password",
  auth("admin", "user"),
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

export const authRouter = router;
