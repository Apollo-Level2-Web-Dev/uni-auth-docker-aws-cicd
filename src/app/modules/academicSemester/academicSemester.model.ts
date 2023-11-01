import { Schema, model } from 'mongoose';
import { AcademicSemesterModel, IAcademicSemester } from './academicSemester.interfaces';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const AcademicSemesterSchema = new Schema<IAcademicSemester, AcademicSemesterModel>(
  {
    title: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    startMonth: {
      type: String,
      required: true
    },
    endMonth: {
      type: String,
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

AcademicSemesterSchema.pre('save', async function (next) {
  const isExist = await AcademicSemester.findOne({ title: this.title, year: this.year });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Academic Semester already exists');
  }
  next();
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  AcademicSemesterSchema
);
