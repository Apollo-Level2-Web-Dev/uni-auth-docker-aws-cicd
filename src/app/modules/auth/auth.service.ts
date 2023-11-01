import * as bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/apiError';
import { EmailHelper } from '../../../helpers/emailHelper';
import { JwtHelper } from '../../../helpers/jwtHelper';
import { RedisClient } from '../../../shared/redis';
import { hideEmail } from '../../../shared/utils';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { User } from '../user/user.model';
import {
  IForgotPasswordRequest,
  ILoginUserRequest,
  ILoginUserResponse,
  IPasswordChangeRequest,
  IRefreshTokenResponse,
  IResetPasswordRequest
} from './auth.interfaces';

const loginUser = async (payload: ILoginUserRequest): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const isUserExist = await User.findOne(
    { id },
    { password: 1, id: 1, role: 1, needsPasswordChange: 1 }
  );

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isPasswordMatched = await isUserExist.isPasswordCorrect(password, isUserExist.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = await JwtHelper.createToken({ id: isUserExist.id, role: isUserExist.role });
  const refreshToken = await JwtHelper.createRefreshToken({
    id: isUserExist.id,
    role: isUserExist.role
  });

  await RedisClient.setAccessToken(id, accessToken);

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExist?.needsPasswordChange
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  const verifiedToken = await JwtHelper.verifyRefreshToken(token);

  const { id } = verifiedToken;

  const isUserExist = await User.findOne({ id }, { password: 1, id: 1, role: 1 });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const accessToken = await JwtHelper.createToken({ id: isUserExist.id, role: isUserExist.role });

  const refreshToken = await JwtHelper.createRefreshToken({
    id: isUserExist.id,
    role: isUserExist.role
  });

  await RedisClient.setAccessToken(id, accessToken);

  return {
    accessToken,
    refreshToken
  };
};

const changePassword = async (
  id: string,
  payload: IPasswordChangeRequest
): Promise<{
  message: string;
}> => {
  const { oldPassword, newPassword } = payload;

  const user = await User.findOne({ id }, { password: 1, id: 1, role: 1 });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isMatched = await user.isPasswordCorrect(oldPassword, user.password);

  if (!isMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Provided old password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, config.jwt.saltRounds);

  await User.updateOne(
    { id },
    { password: newHashedPassword, needsPasswordChange: false, passwordChangedAt: new Date() }
  );

  return {
    message: 'Password changed successfully'
  };
};

const forgotPassword = async (
  payload: IForgotPasswordRequest
): Promise<{
  message: string;
}> => {
  const { id } = payload;

  const user = await User.findOne({ id }, { id: 1, role: 1, needsPasswordChange: 1 });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (user.needsPasswordChange) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'First login with your default password and then change password'
    );
  }

  let profile = null;

  if (user.role === ENUM_USER_ROLE.STUDENT) {
    profile = await Student.findOne({ id });
  } else if (user.role === ENUM_USER_ROLE.FACULTY) {
    profile = await Faculty.findOne({ id });
  } else if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found in profile');
  }

  const passwordResetToken = await JwtHelper.createPasswordResetToken({
    id: user.id
  });

  const passwordResetLink = `${config.forgotPasswordResetUiLink}id=${id}&token=${passwordResetToken}`;

  const emailContent = await EmailHelper.createEmailContent(
    { resetLink: passwordResetLink },
    'sendForgotPasswordEmail'
  );

  await EmailHelper.sendEmail({
    to: profile.email,
    subject: `Forgot Password Reset Link`,
    html: emailContent
  });

  await User.updateOne(
    { id },
    {
      passwordResetToken
    }
  );

  const message = `Password reset link is sent to ${hideEmail(profile.email)}`;

  return {
    message
  };
};

const resetPassword = async (
  payload: IResetPasswordRequest
): Promise<{
  message: string;
}> => {
  const { id, newPassword } = payload;

  const user = await User.findOne({ id }, { id: 1, passwordResetToken: 1 });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!user.passwordResetToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password reset token not found');
  }

  const verifiedToken = await JwtHelper.verifyPasswordResetToken(user.passwordResetToken);

  const newHashedPassword = await bcrypt.hash(newPassword, config.jwt.saltRounds);

  await User.updateOne(
    { id },
    { password: newHashedPassword, passwordResetToken: null, passwordChangedAt: new Date() }
  );

  return {
    message: 'Password reset successfully. Please login with new password'
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  resetPassword,
  forgotPassword
};
