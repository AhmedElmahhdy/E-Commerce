import  {Schema , model , Types } from "mongoose";

const addressShema = new Schema({
    userId :{
        type: Types.ObjectId,
        ref : "User",
        required: true,
    },
    country:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    street:{
        type: String,
        required: true
    },
    postalCode:{
        type : Number,
        require:true
    },
    buildingNumber :{
        type:Number,
        require:true
    },
    flootNumber :{
        type:Number,
        require:true
    },
    addressLabel:String,
    isDefault : {
        type:Boolean,
        default:false
    },
    isMarkedDelete :{
        type:Boolean,
        default:false
    }


},{timestamps: true, versionKey:false})


export const Address = model('Address' , addressShema)

