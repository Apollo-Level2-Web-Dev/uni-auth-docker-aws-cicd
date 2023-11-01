import { Schema, model } from 'mongoose';
import { IPermission, PermissionModel } from './permission.interfaces';

const PermissionSchema = new Schema<IPermission, PermissionModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

export const Permission = model<IPermission, PermissionModel>('Permission', PermissionSchema);
