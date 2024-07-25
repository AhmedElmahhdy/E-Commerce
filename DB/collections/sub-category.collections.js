import { Schema , model, Types } from "mongoose";

const subCategoryShema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    image: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    addedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    }   
},{
    timestamps: true,
    versionKey: false   
})

export const SubCategory = model("SubCategory", subCategoryShema)