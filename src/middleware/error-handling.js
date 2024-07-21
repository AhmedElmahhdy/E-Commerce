import ErrorClass from "../utils/Error-class.js";

export const errorHandler = ( API) => {
    return (req,res,next)=>{
        API(req,res,next).catch(err=>{
            next(new ErrorClass(err.message,500))})
    }
}

export const globalResponse = (err,req,res,next)=>{
    if (err) {
        res.json({
            error:'Faill Response',
            message:err.message,
            stack:err.stack
        })
       }

}