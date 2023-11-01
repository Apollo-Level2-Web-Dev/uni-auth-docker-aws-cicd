import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper
} from './academicSemester.constants';
import { IAcademicSemester, IAcademicSemesterFilterRequest } from './academicSemester.interfaces';
import { AcademicSemester } from './academicSemester.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const getAllFromDB = async (
  filters: IAcademicSemesterFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicSemesterSearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IAcademicSemester> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await AcademicSemester.find(
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
  );

  const total = await AcademicSemester.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const insertIntoDB = async (payload: IAcademicSemester): Promise<IAcademicSemester | null> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getByIdFromDB = async (id: string): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<IAcademicSemester>
): Promise<IAcademicSemester | null> => {
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid code');
  }

  const result = await AcademicSemester.findByIdAndUpdate(
    id,
    {
      $set: payload
    },
    { new: true }
  );
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findByIdAndDelete(id);
  return result;
};

export const AcademicSemesterService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertIntoDB
};
