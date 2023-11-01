import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { academicDepartmentSearchableFields } from './academicDepartment.constants';
import {
  IAcademicDepartment,
  IAcademicDepartmentFilterRequest
} from './academicDepartment.interfaces';
import { AcademicDepartment } from './academicDepartment.model';

const getAllFromDB = async (
  filters: IAcademicDepartmentFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IAcademicDepartment[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicDepartmentSearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IAcademicDepartment> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await AcademicDepartment.find(
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
  ).populate('academicFaculty');

  const total = await AcademicDepartment.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const insertIntoDB = async (payload: IAcademicDepartment): Promise<IAcademicDepartment | null> => {
  const result = (await AcademicDepartment.create(payload)).populate('academicFaculty');
  return result;
};

const getByIdFromDB = async (id: string): Promise<IAcademicDepartment | null> => {
  const result = await AcademicDepartment.findById(id).populate('academicFaculty');
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<IAcademicDepartment>
): Promise<IAcademicDepartment | null> => {
  const result = await AcademicDepartment.findByIdAndUpdate(
    id,
    {
      $set: payload
    },
    { new: true }
  ).populate('academicFaculty');
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IAcademicDepartment | null> => {
  const result = await AcademicDepartment.findByIdAndDelete(id).populate('academicFaculty');
  return result;
};

export const AcademicDepartmentService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertIntoDB
};
