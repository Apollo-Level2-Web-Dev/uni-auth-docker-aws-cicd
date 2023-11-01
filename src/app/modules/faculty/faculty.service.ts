import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { facultySearchableFields } from './faculty.constants';
import { IFaculty, IFacultyFilterRequest } from './faculty.interfaces';
import { Faculty } from './faculty.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const getAllFromDB = async (
  filters: IFacultyFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IFaculty[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IFaculty> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Faculty.find(
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
    .populate('academicDepartment');

  const total = await Faculty.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const getByIdFromDB = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id })
    .populate('academicFaculty')
    .populate('academicDepartment');
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<IFaculty>): Promise<IFaculty | null> => {
  const faculty = await Faculty.findOne({ id });

  if (!faculty) throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');

  const { name, ...facultyData } = payload;

  const updateDataFaculty: Partial<IFaculty> = { ...facultyData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      (updateDataFaculty as any)[`name.${key}`] = (name as any)[key];
    });
  }

  const result = await Faculty.findOneAndUpdate(
    { id },
    {
      $set: updateDataFaculty
    },
    { new: true }
  )
    .populate('academicFaculty')
    .populate('academicDepartment');
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOneAndDelete({ id })
    .populate('academicFaculty')
    .populate('academicDepartment');
  return result;
};

export const FacultyService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
