import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config/config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User is logged in succesfully!",
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password is updated successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthServices.forgetPasswordLinkGenerate(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Forget Password Link is generated successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.user;
  const token = req.headers.authorization;
  const result = await AuthServices.resetPasswordIntoDB(
    { userId, newPassword },
    token as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password was reset successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
