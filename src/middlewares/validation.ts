import { celebrate, Joi, Segments } from 'celebrate';
import { Types } from 'mongoose';

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:\\/?#[\]@!$&'()*+,;=.]+$/;

export const cardValidationRules = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Поле name должно состоять минимум из 2 символов',
        'string.max': 'Поле name не может превышать 30 символов',
        'any.required': 'Поле name обязательно для заполнения',
        'string.empty': 'Поле name не должно быть пустым',
      }),
    link: Joi.string()
      .pattern(URL_REGEX)
      .required()
      .messages({
        'string.pattern.base': 'Поле link должно содержать корректный URL',
        'any.required': 'Поле link обязательно для заполнения',
        'string.empty': 'Поле link не может быть пустым',
      }),
  }),
});

export const idValidationRules = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ any: 'Передан неверный id' });
      }),
  }),
});

export const cardIdValidationRules = celebrate({
  [Segments.PARAMS]: Joi.object({
    cardId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ any: 'Передан неверный id карточки' });
      }),
  }),
});

export const userDataValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Длина поля name должна быть не менее 2 символов',
        'string.max': 'Длина поля name не должна превышать 30 символов',
      }),
    about: Joi.string()
      .min(2)
      .max(200)
      .messages({
        'string.min': 'Длина поля about должна быть не менее 2 символов',
        'string.max': 'Длина поля about не должна превышать 200 символов',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Введите корректный email',
        'any.required': 'Поле email обязательно',
        'string.empty': 'Поле email не должно быть пустым',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Поле password обязательно для заполнения',
        'string.empty': 'Поле password не может быть пустым',
      }),
    avatar: Joi.string()
      .pattern(URL_REGEX)
      .messages({
        'string.pattern.base': 'Поле avatar должно быть ссылкой',
      }),
  }),
});

export const profileInfoValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'Имя должно содержать не менее 2 символов',
        'string.max': 'Имя не должно превышать 30 символов',
        'any.required': 'Поле name обязательно для заполнения',
        'string.empty': 'Поле name не может быть пустым',
      }),
    about: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'Поле about должно содержать не менее 2 символов',
        'string.max': 'Поле about не должно превышать 200 символов',
        'any.required': 'Поле about обязательно для заполнения',
        'string.empty': 'Поле about не может быть пустым',
      }),
  }),
});

export const avatarUrlValidation = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string()
      .pattern(URL_REGEX)
      .required()
      .messages({
        'string.pattern.base': 'Поле avatar должно содержать корректный URL',
        'any.required': 'Поле avatar обязательно для заполнения',
        'string.empty': 'Поле avatar не может быть пустым',
      }),
  }),
});

export const credentialsValidationRules = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Введите корректный email',
        'any.required': 'Поле email обязательно для заполнения',
        'string.empty': 'Поле email не может быть пустым',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Поле password обязательно для заполнения',
        'string.empty': 'Поле password не может быть пустым',
      }),
  }),
});
