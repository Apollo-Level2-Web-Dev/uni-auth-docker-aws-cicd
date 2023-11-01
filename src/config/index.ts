import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('3000')
    .refine((val) => Number(val)),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  JWT_SALT_ROUNDS: z
    .string()
    .default('8')
    .refine((val) => Number(val)),
  SUPER_ADMIN_PASSWORD: z.string(),
  USER_DEFAULT_PASSWORD: z.string(),
  PASSWORD_RESET_TOKEN_EXPIRES_IN: z.string(),
  FORGOT_PASSWORD_RESET_UI_LINK: z.string(),
  REDIS_URL: z.string(),
  REDIS_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string()
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DATABASE_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    expirationTime: envVars.JWT_EXPIRES_IN,
    refreshExpirationTime: envVars.JWT_REFRESH_EXPIRES_IN,
    saltRounds: Number(envVars.JWT_SALT_ROUNDS),
    passwordResetTokenExpirationTime: envVars.PASSWORD_RESET_TOKEN_EXPIRES_IN
  },
  superAdminPassword: envVars.SUPER_ADMIN_PASSWORD,
  userDefaultPassword: envVars.USER_DEFAULT_PASSWORD,
  forgotPasswordResetUiLink: envVars.FORGOT_PASSWORD_RESET_UI_LINK,
  mail: {
    gmail: {
      clientId: '20881293335-blltjvpmiinifrpqqtke2ktm01nr8p81.apps.googleusercontent.com',
      clientSecret: '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',
      tokens: {
        access_token:
          'ya29.a0AVvZVsqI8vaOVU66_8BFZwxRnGPJFp9k9nNhesvjrl9disCHBTp6pMGkruMI5G4SRVX57D4Rq5vMu_KrMLPT6b4IsLb8vic-gvlhRFCs39atBIaDhEcM4rBHfAqeV3dduV-W624YelgOroIhcBrHtxX_86ABaCgYKAZISARESFQGbdwaIpO8fMi2fcNGu5fyvJSagqg0163',
        refresh_token:
          '1//0gkf3xtDb3tp-CgYIARAAGBASNgF-L9IrayaA7h9hxZ8dCQFEDakQhH2ONVWkKHuzoSOtFM0EnrBOxMa5BCFMrVgNr6uXk8N9bQ',
        scope: 'https://www.googleapis.com/auth/gmail.send',
        token_type: 'Bearer',
        expiry_date: 1677699350204
      }
    }
  },
  redis: {
    url: envVars.REDIS_URL,
    accessTokenExpirationTime: Number(envVars.REDIS_ACCESS_TOKEN_EXPIRES_IN)
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET
  }
};
