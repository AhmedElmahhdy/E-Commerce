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

// create a stripe payment method
export const createStripePaymentMethod = async ({token}) => {
    console.log(token);
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {token}
    })
    return paymentMethod
}

// create a stripe payment intent
export const createPaymentIntent = async ({amount, currency}) => {
    const paymentMethod = await createStripePaymentMethod({token:"tok_visa"})
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
        },
        payment_method: paymentMethod.id    
    })

    return paymentIntent
}

// retrieve a stripe payment intent
export const retrievePaymentIntent = async ({paymentIntentId}) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
}

// confirm a stripe payment intent
export const confirmPaymentIntent = async ({paymentIntentId}) => {
    const paymentDetails = await retrievePaymentIntent({paymentIntentId})
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId,{
        payment_method: paymentDetails.payment_method

    })
    return paymentIntent
}