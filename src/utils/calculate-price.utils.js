import { discountType } from "./utils-index.js";

export const calculatePrice = (price, discount) => {
   let appliedPrice = price 
    if(discount.type == discountType.percentage){
      appliedPrice = price - (price * discount.amount) / 100
    }
    // if fixed
    else if(discount.type == discountType.fixed){
       appliedPrice = price - discount.amount 
     }

    return appliedPrice
}


export const applyCoupon = (price, coupon) => {
    let appliedCouponPrice = 0
    console.log("price:",price);
    console.log("coupon:",coupon);

    if(coupon.couponType == discountType.percentage){
        appliedCouponPrice = price - (price * coupon.couponAmount) / 100
        console.log("appliedCouponPrice 1:",appliedCouponPrice);
    }

    // if fixed
    else if(coupon.couponType == discountType.fixed){
        appliedCouponPrice = price - coupon.couponAmount
    }
    console.log("appliedCouponPrice:",appliedCouponPrice);
    return appliedCouponPrice
}
    