import { Schema, model } from "mongoose";

const userShema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true   // Allows the phoneNumber to be optional
    },
    isPhoneNumberVerified: {
        type: Boolean,
        default: false
    },  
    address: {
        type: String,
    },
    Age: {
        type: Number,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isloggedIn: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true, 
    versionKey: false
})



export const User = model("User", userShema)