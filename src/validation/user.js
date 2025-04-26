import Joi from 'joi';

export const updateUserProfileSchema = Joi.object({
  photo: Joi.string()
    .trim()
    .pattern(
      new RegExp(
        '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?(\\.(jpg|jpeg|png|gif|bmp|webp))?$',
      ),
    )
    .max(500)
    .messages({
      'string.pattern.base':
        'Photo must be a valid image URL with a supported format (jpg, jpeg, png, gif, bmp, webp)',
      'string.max': 'Photo URL cannot exceed 500 characters',
    }),
  name: Joi.string().trim().min(2).max(20).messages({
    'string.min': 'Name should have at least 2 characters',
    'string.max': 'Name should have at most 20 characters',
  }),
})
  .min(1)
  .messages({
    'object.min':
      'The profile update request body cannot be empty. It must contain at least one field to update',
  });
