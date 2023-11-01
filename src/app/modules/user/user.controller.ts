import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/response';
import { permissionFilterableFields } from '../permission/permission.constants';
import { userFilterableFields } from './user.constants';
import { UserService } from './user.service';
import { IUploadedFile } from '../../../interfaces/file';

const getUserAvailablePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = pick(req.params, ['id']);
    const filters = pick(req.query, permissionFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await UserService.getUserAvailablePermissions(
      params.id as string,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions fetched successfully',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

const getUserAssignedPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = pick(req.params, ['id']);
    const filters = pick(req.query, permissionFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await UserService.getUserAssignedPermissions(
      params.id as string,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions fetched successfully',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

const assignPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = pick(req.params, ['id']);
    const { permissionIds } = pick(req.body, ['permissionIds']);

    const result = await UserService.assignPermissions(params.id as string, {
      permissionIds: permissionIds as string[]
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions assigned successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const removePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = pick(req.params, ['id']);
    const { permissionIds } = pick(req.body, ['permissionIds']);

    const result = await UserService.removePermissions(params.id as string, {
      permissionIds: permissionIds as string[]
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions removed successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const resetUserPasswordToDefault = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = pick(req.params, ['id']);

    const result = await UserService.resetUserPasswordToDefault(params.id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin: adminData, ...userData } = req.body;
    userData.role = 'admin';
    const result = await UserService.createAdmin(userData, adminData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createAdminFromFormData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin: adminData, ...userData } = req.body;
    userData.role = 'admin';
    const result = await UserService.createAdminFromFormData(
      req.file as IUploadedFile,
      userData,
      adminData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student: studentData, ...userData } = req.body;
    userData.role = 'student';
    const result = await UserService.createStudent(userData, studentData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createStudentFromFormData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { student: studentData, ...userData } = req.body;
    userData.role = 'student';
    const result = await UserService.createStudentFromFormData(
      req.file as IUploadedFile,
      userData,
      studentData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { faculty: facultyData, ...userData } = req.body;
    userData.role = 'faculty';
    const result = await UserService.createFaculty(userData, facultyData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const createFacultyFromFormData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { faculty: facultyData, ...userData } = req.body;
    userData.role = 'faculty';
    const result = await UserService.createFacultyFromFormData(
      req.file as IUploadedFile,
      userData,
      facultyData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await UserService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched successfully',
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateOneInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.updateOneInDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.deleteByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const result = await UserService.getMyProfile(user.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Profile fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const forceLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await UserService.forceLoggedOut(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged out successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllFromDB,
  createAdmin,
  createStudent,
  createFaculty,
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
  createAdminFromFormData,
  createFacultyFromFormData
};
