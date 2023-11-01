export interface ILoginUserRequest {
  id: string;
  password: string;
}

export interface ILoginUserResponse {
  accessToken: string;
  refreshToken: string;
  needsPasswordChange: boolean | undefined;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  id: string;
}

export interface IResetPasswordRequest {
  id: string;
  newPassword: string;
}
