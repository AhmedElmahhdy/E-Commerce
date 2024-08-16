// import { ErrorClass } from "../utils/error-class.utils.js";

import ErrorClass from "../utils/Error-class.js";




export const validationMiddleware=(schema)=>{
    return(req,res,next)=>{
       let errors=[]
        const validationresult=schema.validate(req.body,{abortEarly: false})
         if(validationresult?.error)
            errors.push(...validationresult.error.details)
        if(errors.length) 
            {
                console.log("validation error section");
                return next(new ErrorClass("validation error", 401, errors.map(ele => ele.message)))
            }
           
        next()
    }
}


// export const validationMiddleware = (schema) => {
//     return (req,res,nest)=>{
//         const { error } = schema.validate(req.body, { abortEarly: false });
//         if(error) return  res.status(400).json({
//             err_msg: "validation error",
//             errors: error.details.map(ele => ele.message)
//         })
//         // TODO: add Error Class


//         nest()
//     }
// }