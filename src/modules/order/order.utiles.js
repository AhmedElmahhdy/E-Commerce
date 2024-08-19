import { DateTime } from "luxon"
import { Coupon } from "../../../DB/collections-index.js"


export const validateCoupon = async (couponCode,userId)=>{
    const coupon = await Coupon.findOne({couponCode})
    if (!coupon) return ({message:"coupon not found",error:true})
    if (coupon.isEnabled == false) return ({message:"coupon not enabled",error:true})
    if (DateTime.fromJSDate(coupon.from) < DateTime.now()) return ({message:"coupon not available now",error:true})
    if (DateTime.fromJSDate(coupon.till) < DateTime.now()) return ({message:"coupon expired",error:true})
    if (coupon.User.includes(userId)) return ({message:"coupon already used",error:true})
    if (coupon.User.maxCount <= coupon.User.usagedCount) return ({message:"you reached max count to use this coupon",error:true})
    return ({message:"coupon valid",error:false,coupon})
}