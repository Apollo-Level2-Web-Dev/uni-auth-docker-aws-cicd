import { Model, Types } from 'mongoose';
import { IPermission } from '../permission/permission.interfaces';
import { IUser } from '../user/user.interfaces';

export interface IUserPermission {
  permission: Types.ObjectId | IPermission;
  user: Types.ObjectId | IUser;
}

export type UserPermissionModel = Model<IUserPermission, object>;
