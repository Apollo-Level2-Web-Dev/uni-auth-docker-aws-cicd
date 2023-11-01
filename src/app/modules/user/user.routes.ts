import express, { Request, Response, NextFunction } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
import { FileUploadHelper } from '../../../helpers/fileUploadHelper';

const router = express.Router();

router.get('/', UserController.getAllFromDB);
router.get(
  '/my-profile',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT
  ),
  UserController.getMyProfile
);
router.get('/:id/available-permissions', UserController.getUserAvailablePermissions);
router.get('/:id/assigned-permissions', UserController.getUserAssignedPermissions);
router.get('/:id', UserController.getByIdFromDB);

router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdmin),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.createAdmin
);
router.post(
  '/create-student',
  validateRequest(UserValidation.createStudent),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.createStudent
);

router.post(
  '/create-faculty',
  validateRequest(UserValidation.createFaculty),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.createFaculty
);

router.post(
  '/create-student-using-form-data',
  FileUploadHelper.upload.single('file'),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createStudentFormData.parse(JSON.parse(req.body.data));
    return UserController.createStudentFromFormData(req, res, next);
  }
);

router.post(
  '/create-faculty-using-form-data',
  FileUploadHelper.upload.single('file'),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createFacultyFormData.parse(JSON.parse(req.body.data));
    return UserController.createFacultyFromFormData(req, res, next);
  }
);

router.post(
  '/create-admin-using-form-data',
  FileUploadHelper.upload.single('file'),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminFormData.parse(JSON.parse(req.body.data));
    return UserController.createAdminFromFormData(req, res, next);
  }
);

router.post(
  '/:id/remove-permissions',
  validateRequest(UserValidation.removePermissions),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.removePermissions
);

router.post(
  '/:id/assign-permissions',
  validateRequest(UserValidation.assignPermissions),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.assignPermissions
);

router.post(
  '/:id/reset-password-to-default',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.resetUserPasswordToDefault
);

router.post(
  '/:id/force-logged-out',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.forceLoggedOut
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUser),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT
  ),
  UserController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.deleteByIdFromDB
);

export const userRoutes = router;
