import { User } from "../../DB/collections/user.collections.js";
import ErrorClass from "../utils/Error-class.js";



export const cheackId = (model) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const doc = await model.findById(id);
        if (!doc) return next(new ErrorClass("Document not found", 404));
        req.doc = doc;
        next();
    };
}

export const checkUser = () =>{
    return async (req,res,next)=>{
        const {email} = req.body 
        const user = await User.findOne({email})    
        if(!user) return next(new ErrorClass("user not found",404))
        req.userData = user
        next()
    }
}