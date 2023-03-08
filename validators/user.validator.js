const Joi = require('joi');

const userValidator = Joi.object({
    firstName: Joi.string()
        .alphanum()
        .min(3)
        .required(),
    lastName: Joi.string()
        .alphanum()
        .required(),
    email: Joi.string().email(),
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(8)
        .required(),
    confirmPassword: Joi.ref('password'),
    username: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
})

// validation middleware
exports.userInputValidation = async (req,res,next) => {
    const userPayload = req.body;
    try{
        await userValidator.validateAsync(userPayload);
        next()
    } catch(error){
        next({
            message: error.details[0].message,
            status: 400,
        });
    };
};
