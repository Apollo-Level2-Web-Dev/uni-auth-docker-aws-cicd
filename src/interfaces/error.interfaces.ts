export interface IMongooseServerError extends Error {
  keyValue: string[];
}

export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}
