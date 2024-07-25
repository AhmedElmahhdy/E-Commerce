import { User } from "../../../DB/collections/user.collections.js"
import ErrorClass  from "../../utils/Error-class.js"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import sendEmail from "../../services/send-email.services.js"

// =========================== Sign Up ===========================
export const signUp = async (req,res,next)=>{ 
   const {name,email,password} = req.body
   const isUserExist = await User.findOne({email})
 
   if(isUserExist) return next(new ErrorClass("User already exist",400))

   const hashPassword = bcryptjs.hashSync(password,10)
    const user = new User({
        name,
        email,
        password:hashPassword
    }) 
  // create token
  const token = jwt.sign({id:user._id},process.env.VERFIY_EMAIL_SECRET_KEY)
  // create verfication link
  const validationLink = `${req.protocol}://${req.headers.host}/user/verfiy-email/${token}`
  // send email 
//   const isSentEmail = await sendEmail({
//     to: email,
//     from: "E-Commerce <" + process.env.EMAIL_USER + ">",
//     subject: "Sign Up verification",
//     text:`
//         <h1>Welcome to E-Commerce App ${user.username}.</h1> <br>
//         <a href="${validationLink}"> Click here to verify your account</a>`
//     })
//     if (!isSentEmail) {
//     return next(new ErrorClass("Email not sent",500));
//     }
     
  await user.save()
   res.json({message:"User created successfully"})
}

// =========================== Verfiy Email ===========================
export const verfiyEmail = async (req,res,next)=>{
    const {token} = req.params
    const decoded = jwt.verify(token,process.env.VERFIY_EMAIL_SECRET_KEY)
    const user = await User.findOne({_id:decoded.id})
    if(!user) return next(new ErrorClass("User not found",404))
    if (user.confirmEmail) return res.status(400).json({message:"Email already verfiyed"}) 
    user.confirmEmail = true
    await user.save()
    res.json({message:"Email verfiyed"})
}