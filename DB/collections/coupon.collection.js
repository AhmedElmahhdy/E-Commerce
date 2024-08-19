import { Schema, model, Types } from "mongoose";
import { couponType } from "../../src/utils/utils-index.js";

const couponSchema = new Schema({
        couponCode:{
            type:String,
            require:true,
            unique:true
        },
        couponAmount:{
            type: Number,
            require:true
        },
        couponType:{
            type: String,
            enum:Object.values(couponType) 
        },
        from:{
            type:Date,
            require:true,
            default:Date.now()
        },
        till:{
            type:Date,
            require:true
        },
        User:[
            {
                userId:{
                    type:Types.ObjectId,
                    ref:"User",
                    
                },
                maxCount:{
                    type:Number,
                    min:1
                },
                usagedCount:{
                    type:Number,
                    default:0
                }
            }
        ],
        isEnabled:{
            type:Boolean,
            default:false
        },
        addedBy:{
            type:Types.ObjectId,
            ref:"User"
        }
        

},{timestamps:true,versionKey:false})


export const Coupon = model("Coupon",couponSchema)

// coupon changes model

const couponChangelogSchema = new Schema({
    couponId:{
        type:Types.ObjectId,
        ref:"Coupon"
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    changes:[{
            type:Object,
            required:true,
            values:{
                fieldChanged:{
                    type:String
                },
                oldData:{
                    type:String
                },
                newData:{
                    type:String
                }
            }
    }]

},{timestamps:true,versionKey:false})

export const CouponChangelog = model("CouponChangelog",couponChangelogSchema)