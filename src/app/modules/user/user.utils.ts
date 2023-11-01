import { ENUM_USER_ROLE } from '../../../enums/user';
import { IAcademicSemester } from '../academicSemester/academicSemester.interfaces';
import { User } from './user.model';

// Generate student id
export const generateStudentId = async (academicSemester: IAcademicSemester) => {
  const currentCode = (await findLastStudentId()) || (0).toString().padStart(5, '0');
  let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
  newCode = `${academicSemester.year.toString().substring(2)}${academicSemester?.code}${newCode}`;
  return newCode;
};

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: ENUM_USER_ROLE.STUDENT
    },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1
    })
    .lean();
  return lastStudent?.id ? lastStudent?.id.substring(4) : null;
};

// Generate admin id
export const generateAdminId = async () => {
  const currentCode = (await findLastAdminId()) || (0).toString().padStart(5, '0');
  let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
  newCode = `A-${newCode}`;
  return newCode;
};

export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: ENUM_USER_ROLE.ADMIN
    },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1
    })
    .lean();
  return lastAdmin?.id ? lastAdmin?.id.substring(2) : null;
};

// Generate faculty id
export const generateFacultyId = async () => {
  const currentCode = (await findLastFacultyId()) || (0).toString().padStart(5, '0');
  let newCode = (parseInt(currentCode) + 1).toString().padStart(5, '0');
  newCode = `F-${newCode}`;
  return newCode;
};

export const findLastFacultyId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: ENUM_USER_ROLE.FACULTY
    },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1
    })
    .lean();
  return lastAdmin?.id ? lastAdmin?.id.substring(2) : null;
};
