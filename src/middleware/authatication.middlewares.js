import jwt from "jsonwebtoken";
import ErrorClass from "../utils/Error-class.js";
import { User } from "../../DB/collections-index.js";

export const authatication = ()=>{
    return async(req,res,next) => {
        const {token} = req.headers
        if (!token) return next(new ErrorClass("Token not found", 401));
        if (!token.startsWith(process.env.PREFIX_TOKEN)) return next(new ErrorClass("Invalidddd token", 401));
        const originalToken = token.split(`${process.env.PREFIX_TOKEN} `)[1];
        const decodedToken = jwt.verify(originalToken, process.env.LOGIN_SECRET_KEY_TOKEN)
        if(!decodedToken) return next(new ErrorClass("Invalid token", 401));
        // find user by userId
        const userData = await User.findById(decodedToken.id);
        if (!userData) {
        return next(new ErrorClass("User not found", 404, "User not found"));
     }
         // add the user data in req 
         req.user = userData; 
        next()
    }
}