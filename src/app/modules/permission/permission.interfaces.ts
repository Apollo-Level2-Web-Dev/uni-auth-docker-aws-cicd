import { Model } from 'mongoose';

export interface IPermission {
  title: string;
}

export type PermissionModel = Model<IPermission, object>;

export interface IPermissionFilterRequest {
  searchTerm?: string;
}
