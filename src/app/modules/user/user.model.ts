import * as bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, IUserMethods, UserModel } from './user.interfaces';

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    needsPasswordChange: {
      type: Boolean,
      default: true
    },
    passwordChangedAt: {
      type: Date
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.isPasswordCorrect = async function (givenPassword, userPassword) {
  return await bcrypt.compare(givenPassword, userPassword);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, config.jwt.saltRounds);
  }

  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
