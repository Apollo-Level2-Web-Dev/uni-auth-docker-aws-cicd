import { Model } from 'mongoose';

export interface IAcademicFaculty {
  title: string;
}

export type AcademicFacultyModel = Model<IAcademicFaculty, object>;

export interface IAcademicFacultyFilterRequest {
  searchTerm?: string;
}
