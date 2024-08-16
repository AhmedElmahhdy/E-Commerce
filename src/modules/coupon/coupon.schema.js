import Joi from "joi"
import { couponType,generalValidationRule } from "../../utils/utils-index.js"
import { DateTime } from "luxon";


export const CouponSchema = Joi.object({
   
        couponCode:Joi.string().required(),
        couponType:Joi.string().valid(...Object.values(couponType)).required(),
        isEnabled:Joi.boolean().required(),
        couponAmount:Joi.number().required().when("couponType",
            {
                is:couponType.percentage,
                then:Joi.number().max(100),
                otherwise:Joi.number().min(1)

            }).required().messages({
                'number.max': 'coupon amount must be less than or equal to 100',
                'number.min': 'coupon amount must be greater than or equal to 1',
            }),
        from:Joi.date().greater(DateTime.now()).required(),
        till:Joi.date().greater(Joi.ref("from")).required(),
        Users:Joi.array().items(
            Joi.object({
             userId: generalValidationRule.Id.required(),
             maxCount:Joi.number().min(1).required(),
        })
        )
    })


export const updateCouponSchema = Joi.object({
   
        couponCode:Joi.string().optional(),
        couponType:Joi.string().valid(...Object.values(couponType)).optional(),
        isEnabled:Joi.boolean().optional(),
        couponAmount:Joi.number().when("couponType",
            {
                is:couponType.percentage,
                then:Joi.number().max(100),
                otherwise:Joi.number().min(1)

            }).messages({
                'number.max': 'coupon amount must be less than or equal to 100',
                'number.min': 'coupon amount must be greater than or equal to 1',
            }).optional(),
        from:Joi.date().greater(DateTime.now()).optional(),
        till:Joi.date().optional(),
        Users:Joi.array().items(
            Joi.object({
             userId: generalValidationRule.Id.required(),
             maxCount:Joi.number().min(1).required(),
        })
        ).optional()
    })



export const disableOrEnableCouponSchema = Joi.object({
    isEnabled:Joi.boolean().required()
})






