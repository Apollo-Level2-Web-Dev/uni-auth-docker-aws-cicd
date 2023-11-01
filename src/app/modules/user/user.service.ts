import * as bcrypt from 'bcryptjs';
import mongoose, { FilterQuery } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';
import { PaginationHelper } from '../../../helpers/paginationHelper';
import { IGenericFilterOptions, IGenericResponse } from '../../../interfaces/common';
import { ICloudinaryResponse, IUploadedFile } from '../../../interfaces/file';
import { RedisClient } from '../../../shared/redis';
import { IAcademicSemester } from '../academicSemester/academicSemester.interfaces';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IAdmin } from '../admin/admin.interfaces';
import { Admin } from '../admin/admin.model';
import { IFaculty } from '../faculty/faculty.interfaces';
import { Faculty } from '../faculty/faculty.model';
import { permissionSearchableFields } from '../permission/permission.constants';
import { IPermission, IPermissionFilterRequest } from '../permission/permission.interfaces';
import { Permission } from '../permission/permission.model';
import { IStudent } from '../student/student.interfaces';
import { Student } from '../student/student.model';
import { UserPermission } from '../userPermission/userPermission.model';
import { userSearchableFields } from './user.constants';
import {
  IAssignPermissionRequest,
  IRemovePermissionRequest,
  IUser,
  IUserFilterRequest
} from './user.interfaces';
import { User } from './user.model';
import { generateAdminId, generateFacultyId, generateStudentId } from './user.utils';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const createStudent = async (user: IUser, student: IStudent): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const academicSemester = await AcademicSemester.findById(student.academicSemester);

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateStudentId(academicSemester as IAcademicSemester);

    user.id = id;
    student.id = id;

    const createdStudent = await Student.create([student], { session });

    if (!createdStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Student creation failed');
    }

    user.student = createdStudent[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester'
        },
        {
          path: 'academicDepartment'
        },
        {
          path: 'academicFaculty'
        }
      ]
    });
  }

  return newUser;
};

const createStudentFromFormData = async (
  profileImage: IUploadedFile,
  user: IUser,
  student: IStudent
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const academicSemester = await AcademicSemester.findById(student.academicSemester);

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateStudentId(academicSemester as IAcademicSemester);

    user.id = id;
    student.id = id;

    const uploadedProfileImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(
      profileImage
    );

    if (uploadedProfileImage) {
      student.profileImage = uploadedProfileImage.secure_url;
    }

    const createdStudent = await Student.create([student], { session });

    if (!createdStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Student creation failed');
    }

    user.student = createdStudent[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester'
        },
        {
          path: 'academicDepartment'
        },
        {
          path: 'academicFaculty'
        }
      ]
    });
  }

  return newUser;
};

const createFaculty = async (user: IUser, faculty: IFaculty): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateFacultyId();

    user.id = id;
    faculty.id = id;

    const createdFaculty = await Faculty.create([faculty], { session });

    if (!createdFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faculty creation failed');
    }

    user.faculty = createdFaculty[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicDepartment'
        },
        {
          path: 'academicFaculty'
        }
      ]
    });
  }

  return newUser;
};

const createFacultyFromFormData = async (
  profileImage: IUploadedFile,
  user: IUser,
  faculty: IFaculty
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateFacultyId();

    user.id = id;
    faculty.id = id;

    const uploadedProfileImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(
      profileImage
    );

    if (uploadedProfileImage) {
      faculty.profileImage = uploadedProfileImage.secure_url;
    }

    const createdFaculty = await Faculty.create([faculty], { session });

    if (!createdFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Faculty creation failed');
    }

    user.faculty = createdFaculty[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate('faculty');
  }

  return newUser;
};

const createAdmin = async (user: IUser, admin: IAdmin): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateAdminId();

    user.id = id;
    admin.id = id;

    const createdAdmin = await Admin.create([admin], { session });

    if (!createdAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Admin creation failed');
    }

    user.admin = createdAdmin[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment'
        }
      ]
    });
  }

  return newUser;
};

const createAdminFromFormData = async (
  profileImage: IUploadedFile,
  user: IUser,
  admin: IAdmin
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.userDefaultPassword;
  }

  const session = await mongoose.startSession();

  let newUser = null;

  try {
    session.startTransaction();
    const id = await generateAdminId();

    user.id = id;
    admin.id = id;

    const uploadedProfileImage: ICloudinaryResponse = await FileUploadHelper.uploadToCloudinary(
      profileImage
    );

    if (uploadedProfileImage) {
      admin.profileImage = uploadedProfileImage.secure_url;
    }

    const createdAdmin = await Admin.create([admin], { session });

    if (!createdAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Admin creation failed');
    }

    user.admin = createdAdmin[0]._id;

    const createdUser = await User.create([user], { session });

    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    newUser = createdUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUser) {
    newUser = await User.findOne({ id: newUser.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment'
        }
      ]
    });
  }

  return newUser;
};

const getAllFromDB = async (
  filters: IUserFilterRequest, // Input filters for querying users
  options: IGenericFilterOptions
): Promise<IGenericResponse<IUser | IUser[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options); // Extract limit, page, and skip values for pagination

  const { searchTerm, ...filterData } = filters; // Extract searchTerm and other filter data

  const andConditions = [];

  if (searchTerm) {
    // Add search conditions if searchTerm is provided
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm, // Perform case-insensitive search
          $options: 'i'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    // Add filter conditions if filterData has any keys
    andConditions.push({
      $and: Object.keys(filterData).map((k) => ({
        [k]: (filterData as any)[k]
      }))
    });
  }

  const whereConditions: FilterQuery<IUser> =
    andConditions.length > 0 ? { $and: andConditions } : {}; // Combine all conditions using $and operator

  const result = await User.find(
    whereConditions, // Apply the where conditions to filter the users
    {}, // No projection, retrieve all fields
    {
      skip, // Skip a certain number of results based on pagination
      limit, // Limit the number of results per page,
      sort:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
              createdAt: 'desc'
            }
    }
  )
    .populate('student') // Populate the 'student' field with related data
    .populate('faculty') // Populate the 'faculty' field with related data
    .populate('admin'); // Populate the 'admin' field with related data

  const total = await User.countDocuments(whereConditions); // Get the total count of users matching the conditions

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result // Return the paginated user results
  };
};

const getByIdFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findOne({ id })
    .populate('student')
    .populate('faculty')
    .populate('admin');
  return result;
};

const updateOneInDB = async (id: string, payload: Partial<IUser>): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ id }, payload, { new: true })
    .populate('student')
    .populate('faculty')
    .populate('admin');
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ id });

  if (result) {
    if (result.role === ENUM_USER_ROLE.STUDENT) {
      await Student.deleteOne({ id: result.id });
    } else if (result.role === ENUM_USER_ROLE.FACULTY) {
      await Faculty.deleteOne({ id: result.id });
    } else if (result.role === ENUM_USER_ROLE.ADMIN) {
      await Admin.deleteOne({ id: result.id });
    }
  }
  return result;
};

const assignPermissions = async (
  id: string,
  payload: IAssignPermissionRequest
): Promise<IPermission[]> => {
  const { permissionIds } = payload;

  const user = await Admin.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const permissions = await Permission.find({ _id: { $in: permissionIds } });

  if (permissions.length !== permissionIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid permissions');
  }

  const query = permissionIds.map((permissionId) => ({
    updateOne: {
      filter: { user: user._id, permission: permissionId },
      update: { user: user._id, permission: permissionId },
      upsert: true
    }
  }));

  await UserPermission.bulkWrite(query as any);

  const assignedPermissions = await Permission.find({
    _id: { $in: permissionIds }
  });

  return assignedPermissions;
};

const removePermissions = async (
  id: string,
  payload: IRemovePermissionRequest
): Promise<{
  message: string;
}> => {
  const { permissionIds } = payload;

  const user = await Admin.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await UserPermission.deleteMany({ user: user._id, permission: { $in: permissionIds } });

  return {
    message: 'Permissions removed successfully'
  };
};

const getUserAvailablePermissions = async (
  id: string,
  filters: IPermissionFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IPermission[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const user = await Admin.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userPermissions = await UserPermission.find({ user: user._id }).distinct('permission');

  const whereConditions: mongoose.FilterQuery<IPermission> = {
    _id: { $nin: userPermissions }
  };

  if (filters.searchTerm) {
    whereConditions.$or = permissionSearchableFields.map((field) => ({
      [field]: {
        $regex: filters.searchTerm,
        $options: 'i'
      }
    }));
  }

  const unassignedPermissions = await Permission.find(
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
  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: unassignedPermissions
  };
};

const getUserAssignedPermissions = async (
  id: string,
  filters: IPermissionFilterRequest,
  options: IGenericFilterOptions
): Promise<IGenericResponse<IPermission[]>> => {
  const { limit, page, skip } = PaginationHelper.getPaginationOptions(options);

  const user = await Admin.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userPermissions = await UserPermission.find({ user: user._id }).distinct('permission');

  const whereConditions: mongoose.FilterQuery<IPermission> = {
    _id: { $in: userPermissions }
  };

  if (filters.searchTerm) {
    whereConditions.$or = permissionSearchableFields.map((field) => ({
      [field]: {
        $regex: filters.searchTerm,
        $options: 'i'
      }
    }));
  }

  const assignedPermissions = await Permission.find(
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
  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: assignedPermissions
  };
};

const resetUserPasswordToDefault = async (
  id: string
): Promise<{
  message: string;
}> => {
  const user = await User.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const newHashedPassword = await bcrypt.hash(config.userDefaultPassword, config.jwt.saltRounds);

  await User.updateOne({ id }, { password: newHashedPassword });

  return {
    message: 'Password reset successfully'
  };
};

const getMyProfile = async (id: string): Promise<IStudent | IAdmin | IFaculty | null> => {
  const user = await User.findOne({ id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  let profile = null;

  if (user.role === ENUM_USER_ROLE.STUDENT) {
    profile = await Student.findOne({ id }).populate([
      {
        path: 'academicSemester'
      },
      {
        path: 'academicDepartment'
      },
      {
        path: 'academicFaculty'
      }
    ]);
  } else if (user.role === ENUM_USER_ROLE.FACULTY) {
    profile = await Faculty.findOne({ id }).populate([
      {
        path: 'academicDepartment'
      },
      {
        path: 'academicFaculty'
      }
    ]);
  } else if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ id }).populate([
      {
        path: 'managementDepartment'
      }
    ]);
  }

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  return profile;
};

const forceLoggedOut = async (
  id: string
): Promise<{
  message: string;
}> => {
  await RedisClient.delAccessToken(id);
  return {
    message: 'User logged out successfully'
  };
};

export const UserService = {
  createStudent,
  createAdmin,
  createFaculty,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignPermissions,
  getUserAvailablePermissions,
  getUserAssignedPermissions,
  removePermissions,
  resetUserPasswordToDefault,
  getMyProfile,
  forceLoggedOut,
  createStudentFromFormData,
  createFacultyFromFormData,
  createAdminFromFormData
};
