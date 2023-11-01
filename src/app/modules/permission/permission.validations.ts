import { z } from 'zod';

const createPermission = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    })
  })
});

const updatePermission = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required'
    })
  })
});

export const PermissionValidation = {
  createPermission,
  updatePermission
};
