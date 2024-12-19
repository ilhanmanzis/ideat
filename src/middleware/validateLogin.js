import Joi from "joi";

export const validateLogin = (schema) => {
  return (request, h) => {
    const { error } = schema.validate(request.payload, { abortEarly: false });
    if (error) {
      // Kelompokkan pesan kesalahan berdasarkan field
      const errorMessage = error.details.reduce((acc, err) => {
        const field = err.path[0]; // Mendapatkan nama field yang bermasalah
        acc[field] = err.message; // Simpan pesan kesalahan untuk field tersebut
        return acc;
      }, {});

      return h.response({ 
        status: 'fail',
        message: { errors: errorMessage },
        data: null,
      }).code(400).takeover();
    }
    return h.continue;
  };
};

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email tidak boleh kosong',
      'string.email': 'Email harus dalam format yang valid',
      'any.required': 'Email tidak boleh kosong',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password tidak boleh kosong',
      'string.min': 'Password harus minimal 6 karakter',
      'any.required': 'Password tidak boleh kosong',
    }),
});

