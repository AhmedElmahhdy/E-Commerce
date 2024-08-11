import Joi from "joi";

export const signInShema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(40).pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
})


