import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import sendResponse from '../../../shared/response';
import { AuthService } from './auth.service';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const result = await AuthService.loginUser(body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production'
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// const loginUserCopy = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { body } = req;
//     const result = await AuthService.loginUser(body);

//     res.cookie('refreshToken', result.refreshToken, {
//       httpOnly: true,
//       secure: config.env === 'production'
//     });

//     res.status(httpStatus.OK).json({
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User logged in successfully',
//       data: result
//     })
//   } catch (error) {
//     next(error);
//   }
// };

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production'
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    const result = await AuthService.changePassword(user.id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password changed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    const result = await AuthService.forgotPassword({ id });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, newPassword } = req.body;

    const result = await AuthService.resetPassword({ id, newPassword });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successfully. Please login with new password',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};
