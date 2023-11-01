import { IUser } from '../app/modules/user/user.interfaces';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { ENUM_USER_ROLE } from '../enums/user';

const user: IUser = {
  id: '00001',
  role: ENUM_USER_ROLE.SUPER_ADMIN,
  password: config.superAdminPassword,
  needsPasswordChange: false
};

const seedSuperAdmin = async () => {
  const isSeeded = await User.findOne({ role: ENUM_USER_ROLE.SUPER_ADMIN });

  if (!isSeeded) {
    await User.create(user);
  }
};

export const SeedDB = {
  seedSuperAdmin
};
