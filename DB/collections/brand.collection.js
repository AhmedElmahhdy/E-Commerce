/**
 * name 
 * slug
 * logo 
 * addedBy
 * subCategory
 *category
 * 
 */

import { Schema, model, Types } from "mongoose";

const brandShema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    slug:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    logo : {
        type: String,
        required: true
    },
    addedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    subCategory: {
        type: Types.ObjectId,
        ref: "SubCategory"
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    }
},
{
    timestamps: true, versionKey: false
})

brandShema.post("find", function (doc) {
    doc.forEach((doc) => {
        doc.logo = doc.logo.replace('\\', "/");
      doc.logo = `localhost:3000/${doc.logo}`;
    });
  });

export const Brand = model("Brand", brandShema)

