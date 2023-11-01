import { Model, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interfaces';
import { IFaculty } from '../faculty/faculty.interfaces';
import { IStudent } from '../student/student.interfaces';

export interface IUser {
  id: string;
  role: string;
  password: string;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;

  student?: Types.ObjectId | IStudent;
  admin?: Types.ObjectId | IAdmin;
  faculty?: Types.ObjectId | IFaculty;
}

export interface IUserMethods {
  isPasswordCorrect(givenPassword: string, userPassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, object, IUserMethods>;

export interface IUserFilterRequest {
  searchTerm?: string;
  role?: string;
}

export interface IAssignPermissionRequest {
  permissionIds: string[];
}

export interface IRemovePermissionRequest {
  permissionIds: string[];
}
