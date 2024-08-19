import { DateTime } from "luxon"
import { Address, Cart, Order, Product } from "../../../DB/collections-index.js"
import { applyCoupon ,  orderStatus,paymentMethod,paymentStatus} from "../../utils/utils-index.js"
import {validateCoupon} from "./order.utiles.js"
import ErrorClass from "../../utils/Error-class.js";
import { createCheckoutSession, createPaymentIntent, createStripeCoupon } from "../../payment/stripe.js";

// =============================== create order ==========================
export const createOreder = async (req, res,next) => {
    const userId = req.user._id
    const {address,addressId,couponCode,payment_Method} = req.body

    const deliveryFee = 100

    // prepare order object
    const order = new Order({ 
        userId,
        paymentMethod:payment_Method,
        deliveryFee
    }
    )

    // cheack logged in user's cart with products in cart
    const cart = await Cart.findOne({userId}).populate("Product.productId")
    if(!cart || !cart.Product.length) return next(new ErrorClass("Empty Cart",404,"Empty Cart"))

    // Check products stock 
    const isSoldOut =  cart.Product.find(p=>p.productId.stock < p.Quantity) 
    if(isSoldOut) return next(new ErrorClass("Sold Out",404,`Product ${isSoldOut.productId.name} is sold out`))
    
    // check address 
    if(!address && !addressId) return next(new ErrorClass("Address is required",404,"Address is required"))
    if(addressId){
        const address = await Address.findOne({_id:addressId,userId})
        if(!address) return next(new ErrorClass("Address Not Found",404,"Address Not Found"))
        order.addressId = addressId
    }
    if(address) order.address = address

 

    // calculate total and apply coupone if Exist
    // calculate total if no coupon applied

    order.total = cart.subTotal + deliveryFee

    // if coupon 

    if (couponCode){
        const couponValidation = await validateCoupon(couponCode)
        if(couponValidation.error) return next(new ErrorClass("Coupon validation error",500,couponValidation.message,))
        order.couponCode = couponCode
        console.log("total before coupon",cart.subTotal) + deliveryFee;
        order.total = applyCoupon(cart.subTotal,couponValidation.coupon) + deliveryFee
        console.log("total after coupon",order.total);
    }

    // add products to order
    order.Products.push(...cart.Product)
    let OrderStatus = orderStatus.pending
    if(payment_Method == paymentMethod.cashOnDelivery){
        OrderStatus = orderStatus.placed
    }
    order.orderStatus = OrderStatus
    // save order
    await order.save()
    // clear cart
    cart.Product = []
    await cart.save()

res.json({message:"order created successfully",order})
}

// =============================== get orders ==========================

export const getOrders = async (req, res, next) => {
    const userId = req.user._id 
    const orders = await Order.find({userId})
    res.json({orders})
}

// =============================== cancel order ==========================
export const cancelOrder = async (req, res, next) => {
    const userId = req.user._id
    const orderId = req.params.orderId
    const order = await Order.findOne({_id:orderId,userId , isCancelled:false})
    if(!order) return next(new ErrorClass("order not found",404,"order not found"))

    order.isCancelled = true
    order.orderStatus = orderStatus.canceled
    await order.save()
    res.json({message:"order cancelled successfully"})
}

// =============================== order pay with stripe ===========================
export const payWithStripe = async (req, res, next) => {
    const userId = req.user._id
    const orderId = req.params.orderId
    const order = await Order.findOne({_id:orderId,userId})
    
    if(!order) return next(new ErrorClass("order not found",404,"order not found"))

    const paymentObject = {
        line_items:order.Products.map(item=>{
            console.log(item.name);
            return  {
                price_data:{
                    currency:"EGP",
                    product_data:{
                        name: req.user.name
                    },
                    unit_amount:item.price * 100
                },
                
                quantity:item.Quantity
            }
        }),
        metadata:{orderId:order._id.toString()},
        discounts:[],
        customer_email:req.user.email
    }
   
    if(order.couponCode){
        const stripeCoupon = await createStripeCoupon({couponCode:order.couponCode})
        if(stripeCoupon.status) return next(new ErrorClass(stripeCoupon.message,stripeCoupon.status,"coupon not found"))
        
        paymentObject.discounts.push({
            coupon:stripeCoupon.id
        })
    }

    const payment = await createCheckoutSession(paymentObject)
    const paymentIntent = await createPaymentIntent({amount: order.total, currency: 'EGP'})
    res.json({message:"order payment success",payment,paymentIntent})
}

// =============================== apply webhook locally to confirm the  order =======================
export const webhook = async (req, res, next) => {
    const orderId = req.body.data.object.metadata.orderId

    const order = await Order.findOne({_id:orderId})
    if(!order) return next(new ErrorClass("order not found",404,"order not found"))
    order.orderStatus = orderStatus.paid
    order.paymentStatus = paymentStatus.success
    order.paidAt = DateTime.now()
    await order.save()

    res.json({message:"order paid successfully"})

}