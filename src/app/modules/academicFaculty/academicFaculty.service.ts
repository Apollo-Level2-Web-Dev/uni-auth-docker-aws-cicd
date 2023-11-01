import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { academicFacultySearchableFields } from './academicFaculty.constants';
import { IAcademicFaculty, IAcademicFacultyFilterRequest } from './academicFaculty.interfaces';
import { AcademicFaculty } from './academicFaculty.model';

const getAllFromDB = async (
  filters: IAcademicFacultyFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicFacultySearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IAcademicFaculty> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await AcademicFaculty.find(
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

  const total = await AcademicFaculty.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const insertIntoDB = async (payload: IAcademicFaculty): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getByIdFromDB = async (id: string): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<IAcademicFaculty>
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findByIdAndUpdate(
    id,
    {
      $set: payload
    },
    { new: true }
  );
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findByIdAndDelete(id);
  return result;
};

export const AcademicFacultyService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertIntoDB
};
