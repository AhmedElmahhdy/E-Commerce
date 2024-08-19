import {Schema , model , Types} from "mongoose"

const cartShema =  new Schema({
    userId:{
        type: Types.ObjectId,
        ref: "User",
        require:true
    },
    Product:[
        {
            productId:{
                type:Types.ObjectId,
                ref:"Product",
                require:true
            },
            Quantity:{
                type:Number,
                min:1,
                default:1,
                require:true
            },
            price:{
                type:Number,
                require:true,   
            },
        }
    ],
    subTotal:Number
},{timestamps: true, versionKey:false})

// update subtotal price 
cartShema.pre("save", function(next) {

    this.subTotal = 0
    this.Product.forEach(p => {
        this.subTotal += p.price * p.Quantity
    });

    next()
})

export const Cart = model("Cart",cartShema)