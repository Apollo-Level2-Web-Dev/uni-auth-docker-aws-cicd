import { FilterQuery } from 'mongoose';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { permissionSearchableFields } from './permission.constants';
import { IPermission, IPermissionFilterRequest } from './permission.interfaces';
import { Permission } from './permission.model';

const getAllFromDB = async (
  filters: IPermissionFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IPermission[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: permissionSearchableFields.map((field) => ({
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

  const whereConditions: FilterQuery<IPermission> =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Permission.find(
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

  const total = await Permission.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const insertIntoDB = async (payload: IPermission): Promise<IPermission | null> => {
  const result = await Permission.create(payload);
  return result;
};

const getByIdFromDB = async (id: string): Promise<IPermission | null> => {
  const result = await Permission.findById(id);
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<IPermission>
): Promise<IPermission | null> => {
  const result = await Permission.findByIdAndUpdate(
    id,
    {
      $set: payload
    },
    { new: true }
  );
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IPermission | null> => {
  const result = await Permission.findByIdAndDelete(id);
  return result;
};

export const PermissionService = {
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertIntoDB
};
