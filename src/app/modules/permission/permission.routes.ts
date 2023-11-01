import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { PermissionController } from './permission.controller';
import { PermissionValidation } from './permission.validations';

const router = express.Router();

router.get('/', PermissionController.getAllFromDB);
router.get('/:id', PermissionController.getByIdFromDB);

router.post(
  '/',
  validateRequest(PermissionValidation.createPermission),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PermissionController.insertIntoDB
);

router.patch(
  '/:id',
  validateRequest(PermissionValidation.updatePermission),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PermissionController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  PermissionController.deleteByIdFromDB
);

export const permissionRoutes = router;
