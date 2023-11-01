import { Schema, model } from 'mongoose';
import { IUserPermission, UserPermissionModel } from './userPermission.interfaces';

const UserPermissionSchema = new Schema<IUserPermission, UserPermissionModel>(
  {
    permission: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserPermission = model<IUserPermission, UserPermissionModel>(
  'UserPermission',
  UserPermissionSchema
);
