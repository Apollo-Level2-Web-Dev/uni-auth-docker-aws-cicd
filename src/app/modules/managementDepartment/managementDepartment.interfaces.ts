import { Model } from 'mongoose';

export interface IManagementDepartment {
  title: string;
}

export type ManagementDepartmentModel = Model<IManagementDepartment, object>;

export interface IManagementDepartmentFilterRequest {
  searchTerm?: string;
}
