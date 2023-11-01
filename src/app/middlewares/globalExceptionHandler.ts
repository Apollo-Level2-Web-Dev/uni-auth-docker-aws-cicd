import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/apiError';
import handleMongoCastError from '../../errors/handleMongoCastError';
import handleMongoServerError from '../../errors/handleMongoServerError';
import handleMongoValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interfaces/error.interfaces';
import { errorLogger } from '../../shared/logger';

const globalExceptionHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === 'development'
    ? // eslint-disable-next-line no-console
      console.log('🚀 exceptionHandler ~ error:', error, '🚀')
    : errorLogger.error('🚀 exceptionHandler ~ error:', error);

  let errorMessages: IGenericErrorMessage[] = [];

  let statusCode = 500;
  let message = 'Something went wrong';

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleMongoValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleMongoCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'MongoServerError' && error?.code === 11000) {
    const simplifiedError = handleMongoServerError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message
          }
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message
          }
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined
  });
};

export default globalExceptionHandler;
