import { Schema,model , Types } from "mongoose";

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
        unique: true
    },
    description: {
        type: String,
    }
    // Number section
    ,price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    appliedDiscount: {
       amount:{
         type: Number,
         default: 0
       },
       type: {
        type: String,
        enum: ["Fixed", "percentage"],
        default: "Fixed"
        },

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