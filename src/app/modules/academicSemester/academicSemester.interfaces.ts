import { Model } from 'mongoose';

export interface IAcademicSemester {
  title: string;
  year: number;
  code: string;
  startMonth: string;
  endMonth: string;
}

export type AcademicSemesterModel = Model<IAcademicSemester, object>;

export interface IAcademicSemesterFilterRequest {
  searchTerm?: string;
  code?: string;
  year?: number;
}
