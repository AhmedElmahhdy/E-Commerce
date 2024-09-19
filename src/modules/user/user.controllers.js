import { User } from "../../../DB/collections/user.collections.js"
import ErrorClass  from "../../utils/Error-class.js"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import sendEmail from "../../services/send-email.services.js"
import { genrateOtp } from "../../utils/genrate-otp.js"
import { DateTime } from "luxon"


// =========================== Sign Up ===========================
export const signUp = async (req,res,next)=>{ 
   const {name,email,password} = req.body
   const isUserExist = await User.findOne({email})
 
   if(isUserExist) return next(new ErrorClass("User already exist",401))

   const hashPassword = bcryptjs.hashSync(password,10)
    const user = new User({
        name,
        email,
        password:hashPassword
    }) 
//   create token
 const token = jwt.sign({id:user._id},process.env.VERFIY_EMAIL_SECRET_KEY)
// create verfication link
  const validationLink = `${req.protocol}://${req.headers.host}/user/verfiy-email/${token}`
// send email 
  const isSentEmail = await sendEmail({
    to: email,
    from: "E-Commerce <" + process.env.EMAIL_USER + ">",
    subject: "Sign Up verification",
    text:`
        <h1>Welcome to E-Commerce App ${user.username}.</h1> <br>
        <a href="${validationLink}"> Click here to verify your account</a>`
    })
    if (!isSentEmail) {
    return next(new ErrorClass("Email not sent",500));
    }
     
  await user.save()
   res.json({message:"User created successfully",token})
}

// =========================== Verfiy Email ===========================  
export const verfiyEmail = async (req,res,next)=>{
    const {token} = req.params
    console.log(process.env.VERFIY_EMAIL_SECRET_KEY);
    
    const decoded = jwt.verify(token,process.env.VERFIY_EMAIL_SECRET_KEY)
    console.log(decoded);
    const user = await User.findOne({_id:decoded.id})
    console.log("user:",user);
    
    if(!user) return next(new ErrorClass("User not found",404))
      console.log(user.isEmailVerified);
      
    if (user.isEmailVerified) return res.status(400).json({message:"Email already verfiyed"}) 
    user.isEmailVerified = true
    await user.save()
    res.json({message:"Email verified"})
}

// =========================== Sign In ===========================
export const signIn = async (req,res,next)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user) return next(new ErrorClass("User not found",404))
    if(!user.isEmailVerified) return next(new ErrorClass("Please verfiy your account",400))
    const isMatch = bcryptjs.compareSync(password,user.password)
    if(!isMatch) return next(new ErrorClass("Wrong password",400))
    const token =`${process.env.PREFIX_TOKEN} ${jwt.sign({id:user._id},process.env.LOGIN_SECRET_KEY_TOKEN)}`
    user.isloggedIn = true
    await user.save()
    res.json({message:"Sign in successfully",token})
    }
// =========================== Sign Out ==========================
export const signOut = async (req,res,next)=>{
  const userData = req.user
  if(!userData) return next(new ErrorClass("User not logged in",404))
  userData.isloggedIn = false
  await userData.save()
  res.json({message:"Sign out successfully"})
}

// =========================== Rest Password ===========================
/**
 * @api /user/rest-password
 * logic => 1- search for email 
 *          2- if email exist send email with OTP
 *          3- if email not exist send error
 *          4- take OTP from user and check it with stored OTP and cheack it valid or not
 *          5- if valid send new password
 *          
 */

export const sendOtp = async(req,res,next)=>{
       const user = req.userData
  
      // send  email with OTP 
      const otp = genrateOtp()
      user.otp = otp
      user.otpExpiration = DateTime.now().plus({minutes: 10}).toJSDate()
      console.log(user.otpExpiration);
      
      const otpEmail = await sendEmail({
        to :req.userData.email,
        from: "E-Commerce <" + process.env.EMAIL_USER + ">",
        subject: "Rest Password",
        text:`
        <h1> This OTP is for rest password ${otp}.</h1> <br>`  
      })
      if(!otpEmail) return next(new ErrorClass("email not sent",500))
        
        // save otp in database
        await user.save()
        res.json({message:"OTP sent to your email"})


}

export const validateOtp = async(req,res,next)=>{
  const {otp,email} = req.body
  const user = await User.findOne({email})
  if(!user) return next(new ErrorClass("User not found",404))
  if(user.otp !== otp) return next(new ErrorClass("Wrong OTP",400))
  if(user.otpExpiration < DateTime.now().toJSDate()) return next(new ErrorClass("OTP expired",400))
  user.otp = null
  user.otpExpiration = null
  await user.save()
  res.json({message:"OTP validated"})
}

export const restPassword = async(req,res,next)=>{
  const {password} = req.body
  const user = req.userData
  user.password = hashSync(password,10)
  await user.save()
  res.json({message:"Password changed"})
}



