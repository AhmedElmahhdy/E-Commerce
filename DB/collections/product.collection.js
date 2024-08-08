import { Schema,model , Types } from "mongoose";
import { badge, calculatePrice, discountType } from "../../src/utils/utils-index.js";
import { config } from "dotenv";
config()

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
    overview: {
        type: String,
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
           return calculatePrice(this.price, this.Discount)
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

// retrive all image url with localhost
productShema.post("find", function (doc) {
    doc.forEach((doc) => {
      doc.image.urls = doc.image.urls.map((url) => {
    return `${process.env.BASE_URL}/${url}`;
      });
    });
})
export const Product = model("Product", productShema)