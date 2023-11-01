import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage, IMongooseServerError } from '../interfaces/error.interfaces';

export default function handleMongoServerError(error: IMongooseServerError): IGenericErrorResponse {
  const field = Object.keys(error?.keyValue);
  const statusCode = 409;
  const message = `An account with that ${field} already exists.`;
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: field[0],
      message: message
    }
  ];

  return {
    statusCode,
    message,
    errorMessages
  };
}
