import { Schema, model } from 'mongoose';
import { IAcademicDepartment, AcademicDepartmentModel } from './academicDepartment.interfaces';

const AcademicDepartmentSchema = new Schema<IAcademicDepartment, AcademicDepartmentModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

export const AcademicDepartment = model<IAcademicDepartment, AcademicDepartmentModel>(
  'AcademicDepartment',
  AcademicDepartmentSchema
);
