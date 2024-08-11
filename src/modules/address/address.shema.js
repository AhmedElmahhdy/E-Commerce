import Joi from "joi";

export const addAdressShema = Joi.object({
    country: Joi.string().min(3).max(20).required(),
    city: Joi.string().min(3).max(20).required(),
    street:Joi.string().min(3).max(30).required(),
    postalcode:Joi.string().pattern(/^\d+$/).length(6).required(),// number with 6 digit
    buildingNumber: Joi.number().positive().required(),
    flootNumber:Joi.number().positive().required(),
    addressLabel:Joi.string().min(3).max(20).required(),
    setDefault:Joi.boolean()

})