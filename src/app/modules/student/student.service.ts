import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { studentSearchableFields } from './student.constants';
import { IStudent, IStudentFilterRequest } from './student.interfaces';
import { Student } from './student.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const getAllFromDB = async (
  filters: IStudentFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: studentSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.keys(filterData).map((k) => ({
        [k]: (filterData as any)[k]
      }))
    });
  }

  const whereConditions: FilterQuery<IStudent> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Student.find(
    whereConditions,
    {},
    {
      skip,
      limit,
      sort:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
              createdAt: 'desc'
            }
    }
  )
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');

  const total = await Student.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const getByIdFromDB = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOne({ id })
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<IStudent>): Promise<IStudent | null> => {
  const student = await Student.findOne({ id });

  if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');

  const { name, guardian, localGuardian, ...studentData } = payload;

  const updateDataStudent: Partial<IStudent> = { ...studentData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      (updateDataStudent as any)[`name.${key}`] = (name as any)[key];
    });
  }

  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach((key) => {
      (updateDataStudent as any)[`guardian.${key}`] = (guardian as any)[key];
    });
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach((key) => {
      (updateDataStudent as any)[`localGuardian.${key}`] = (localGuardian as any)[key];
    });
  }

  const result = await Student.findOneAndUpdate(
    { id },
    {
      $set: updateDataStudent
    },
    { new: true }
  )
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOneAndDelete({ id })
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');
  return result;
};

export const StudentService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
