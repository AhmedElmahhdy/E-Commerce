import { Schema, model, Types } from "mongoose";
import { orderStatus, paymentMethod } from "../../src/utils/utils-index.js";
import { Product , Coupon} from "../collections-index.js";



const orderSchema = new Schema({
    // Ids
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    couponCode: { 
        type:String,
        
    },
    addressId: {
        type: Types.ObjectId,
        ref: "Address",
        required: true
    },

    // Details
    Products:[
        {
            productId:{
                type:Types.ObjectId,
                ref:"Product",
                required:true
            },
            Quantity:{
                type:Number,
                min:1,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    isFromCart:{
        type:Boolean,
        default:true
    },
    address:String,
    addressId:{
        type:Types.ObjectId,
        ref:"Address"
    },
    // total price => products price + coupon discount + delivery fee
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: Object.values(paymentMethod),
        required: true
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum:Object.values(orderStatus)
    },
    paidAt: Date,
    paymentIntent:String,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    deliveredBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    isCancelled: {
        type: Boolean,
        default: false
    }
  
    

    
},{timestamps: true, versionKey: false})

orderSchema.pre("save", async function (doc) {
    // decrease stock
    for (const product of this.Products) {
        await Product.updateOne({ _id: product.productId }, { $inc: { stock: -product.Quantity } })    
    }
    // increment usaged count
    if (this.couponCode) {
        const coupon = await Coupon.findOne({couponCode:this.couponCode})
        coupon.User.find(u => u.userId.toString() == this.userId.toString()).usagedCount++
       await  coupon.save()
    }
})


export const Order = model("Order", orderSchema)