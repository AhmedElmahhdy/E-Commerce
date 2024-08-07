import { Schema,model , Types } from "mongoose";
import { badge, discountType } from "../../src/utils/utils-index.js";


const productShema = new Schema({
    // String section 
    name :{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    slug:{
        type: String,
        required: true,
        lowercase: true,
       // unique: true
    },
    description: {
        type: String,
    },
    badge: {
        type: String,
        enum: Object.values(badge),
        default: badge.new
    },
    // Number section
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    Discount: {
       amount:{
         type: Number,
         default: 0
       },
       type: {
        type: String,
        enum: Object.values(discountType),
        default: discountType.fixed
        },

    },
    appliedPrice: {
        type: Number,
        default: function () {
            if(this.Discount.type ==discountType.percentage){
               return  this.price - (this.price*this.Discount.amount)/100
                
            }
            else if(this.Discount.type ==discountType.fixed){
               return  this.price - this.Discount.amount
                
            }
            else{
                return this.price
            }
        }
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    // Boolean section
    isFeatured: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    // Array section
    image: {
       urls:{
        type: [String],
        required: true    
    }
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "SubCategory"
    },
    brand: {
        type: Types.ObjectId,
        ref: "Brand"
    },
    addedBy: {
        type: Types.ObjectId,
        ref: "User"
    }
},{timestamps: true, versionKey: false})


export const Product = model("Product", productShema)