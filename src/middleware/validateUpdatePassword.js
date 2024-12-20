import Joi from "joi";

export const validateUpdatePassword = (schema) => {
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



export const passwordSchema = Joi.object({
  
  oldPassword: Joi.string().min(6).required().messages({
    'string.empty': 'Password lama tidak boleh kosong',
    'string.min': 'Password lama harus minimal 6 karakter',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'Password baru tidak boleh kosong',
    'string.min': 'Password baru harus minimal 6 karakter',
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'string.empty': 'Konfirmasi password baru tidak boleh kosong',
    'any.only': 'Konfirmasi password baru harus sama dengan password',
  })
});