import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: `User created successfully!`,
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserServices.getMeFromDB(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User was retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserIntoDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User status was updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserIntoDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User was deleted successfully!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMe,
  updateUser,
  deleteUser,
};
