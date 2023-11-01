import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interfaces';

export interface IAcademicDepartment {
  title: string;

  academicFaculty: Types.ObjectId | IAcademicFaculty;
}

export type AcademicDepartmentModel = Model<IAcademicDepartment, object>;

export interface IAcademicDepartmentFilterRequest {
  searchTerm?: string;
  academicFaculty?: Types.ObjectId;
}
