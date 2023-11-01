import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { adminSearchableFields } from './admin.constants';
import { IAdmin, IAdminFilterRequest } from './admin.interfaces';
import { Admin } from './admin.model';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const getAllFromDB = async (
  filters: IAdminFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IAdmin> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(
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
  ).populate('managementDepartment');

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const getAllFromDBtest = async (
  filters: IAdminFilterRequest,
  options: {
    limit?: number | undefined;
    page?: number | undefined;
  }
): Promise<IGenericResponse<IAdmin[]>> => {
  const limit = options.limit ? options.limit : 10;
  const page = options.page ? options.page : 1;
  const skip = (page - 1) * limit;

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    // andConditions.push({
    //   $or: adminSearchableFields.map((field) => ({
    //     [field]: {
    //       $regex: searchTerm,
    //       $options: 'i'
    //     }
    //   }))
    // });

    andConditions.push({
      $or: [
        {
          email: {
            $regex: 'hasan',
            $options: 'i'
          }
        },
        {
          contactNo: {
            $regex: 'hasan',
            $options: 'i'
          }
        },
        {
          emergencyContactNo: {
            $regex: 'hasan',
            $options: 'i'
          }
        },
        {
          'name.firstName': {
            $regex: 'hasan',
            $options: 'i'
          }
        },
        {
          'name.lastName': {
            $regex: 'hasan',
            $options: 'i'
          }
        },
        {
          'name.middleName': {
            $regex: 'hasan',
            $options: 'i'
          }
        }
      ]
    });
  }

  if (Object.keys(filterData).length > 0) {
    // andConditions.push({
    //   $and: Object.keys(filterData).map((k) => ({
    //     [k]: (filterData as any)[k]
    //   }))
    // });
    andConditions.push({
      $and: [
        {
          id: '00001'
        }
      ]
    });
  }

  const whereConditions: FilterQuery<IAdmin> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(
    whereConditions,
    {},
    {
      skip,
      limit
    }
  ).populate('managementDepartment');

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const getByIdFromDB = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ id }).populate('managementDepartment');
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<IAdmin>): Promise<IAdmin | null> => {
  const admin = await Admin.findOne({ id });

  if (!admin) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');

  const { name, ...adminData } = payload;

  const updateDataAdmin: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      (updateDataAdmin as any)[`name.${key}`] = (name as any)[key];
    });
  }

  const result = await Admin.findOneAndUpdate(
    { id },
    {
      $set: updateDataAdmin
    },
    { new: true }
  ).populate('managementDepartment');
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOneAndDelete({ id }).populate('managementDepartment');
  return result;
};

export const AdminService = {
  getAllFromDB,
  getAllFromDBtest,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB
};
