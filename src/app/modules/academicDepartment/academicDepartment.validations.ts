import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    }),
    academicFaculty: z.string({
      required_error: 'Academic Faculty is required'
    })
  })
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    academicFaculty: z.string().optional()
  })
});

export const AcademicDepartmentValidation = {
  create,
  update
};
