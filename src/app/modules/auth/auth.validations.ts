import { z } from 'zod';

const loginUser = z.object({
  body: z.object({
    id: z.string({
      required_error: 'ID is required'
    }),
    password: z.string({
      required_error: 'Password is required'
    })
  })
});

const refreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is missing from cookies'
    })
  })
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required'
    }),
    newPassword: z.string({
      required_error: 'New password is required'
    })
  })
});

const forgotPassword = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required'
    })
  })
});

const resetPassword = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New password is required'
    }),
    id: z.string({
      required_error: 'Id is required'
    })
  })
});

export const AuthValidation = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
};
