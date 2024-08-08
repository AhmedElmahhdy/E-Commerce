import { discountType } from "./utils-index.js";

export const calculatePrice = (price, discount) => {
    console.log(discount, price);
   let appliedPrice = price 
    if(discount.type == discountType.percentage){
      appliedPrice = price - (price * discount.amount) / 100
      console.log(appliedPrice);  
      
    }
    // if fixed
    else if(discount.type == discountType.fixed){
       appliedPrice = price - discount.amount 
     }

    return appliedPrice
}