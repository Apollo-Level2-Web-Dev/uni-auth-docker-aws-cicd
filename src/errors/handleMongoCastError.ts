import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error.interfaces';

export default function handleMongoCastError(
  error: mongoose.Error.CastError
): IGenericErrorResponse {
  const statusCode = 400;
  const message = 'Cast Error';
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: `Invalid ${error.path}: ${error.value}`
    }
  ];

  return {
    statusCode,
    message,
    errorMessages
  };
}
