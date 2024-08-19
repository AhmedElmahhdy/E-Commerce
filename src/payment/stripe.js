import Stripe from "stripe";
import { config} from "dotenv";
import { Coupon } from "../../DB/collections-index.js";
import { couponType } from "../utils/enums.utils.js";
config({path:"./config/dev.env"})


const stripe = new Stripe(process.env.SECRET_KEY_STRIPE)

export const createCheckoutSession = async (
    {
    line_items,
    metadata,
    discounts,
    customer_email
    }
) => {

    const sessionIfno = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        line_items,
        metadata,
        discounts,
        customer_email,
        
            
    }
)
return sessionIfno
}



export const createStripeCoupon = async ({couponCode})=>{

    const coupon = await Coupon.findOne({couponCode})
   
    if (!coupon) return {status: 400, message: 'Coupon not found'}


    let couponObject = {}
    console.log(couponType);
    if(coupon.couponType == couponType.fixed){
        couponObject = {
            name:coupon.couponCode,
            amount_off: coupon.couponAmount * 100,
            currency: 'EGP'
        }
    }

    if(coupon.couponType == couponType.percentage){
        couponObject = {    
            name:coupon.couponCode,
            percent_off: coupon.couponAmount ,
        }
    }

    console.log(couponObject);    
    const stripeCoupon = await stripe.coupons.create(couponObject)
    return stripeCoupon
}


// create a stripe payment intent
export const createPaymentIntent = async ({amount, currency}) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
            enabled: true
        }
    })

    return paymentIntent
}