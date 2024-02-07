import mongoose from "mongoose";
import { ZodError, ZodIssue } from "zod";
import {
  TErrorSource,
  TErrorSourceReturnType,
} from "../interfaces/error.interfaces";

export const handleZodError = (err: ZodError): TErrorSourceReturnType => {
  const statusCode = 400;
  const message = `Zod validation Error!`;
  const errorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path.at(-1)!,
      message: issue.message,
    };
  });
  return {
    statusCode,
    message,
    errorSources,
  };
};

export const handleMongoValidationError = (
  err: mongoose.Error.ValidationError
): TErrorSourceReturnType => {
  const statusCode = 400;
  const message = `Mongoose validation Error!`;

  const errorSources = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value.path!,
        message: value.message,
      };
    }
  );

  return {
    statusCode,
    message,
    errorSources,
  };
};

const modifiedCastError = (msg: string) => {
  return msg.split(`(`)[0].replace(/"([^"]+)"/g, "$1");
};

export const handleCastError = (
  err: mongoose.Error.CastError
): TErrorSourceReturnType => {
  const statusCode = 400;
  const message = `Mongoose Cast Error!`;
  // Cast to ObjectId failed for value \"fghfghfgh\"

  const errorSources = [
    {
      path: err?.path,
      message: modifiedCastError(err?.message),
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export const handleDuplicateError = (err: any): TErrorSourceReturnType => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const duplicateField = Object.keys(err.keyValue)[0];
  const errorSources: TErrorSource = [
    {
      path: duplicateField,
      message: `${extractedMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `Mongoose unique value error!`,
    errorSources,
  };
};
