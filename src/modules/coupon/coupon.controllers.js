import ErrorClass from "../../utils/Error-class.js";
import { Coupon, CouponChangelog, User } from "../../../DB/collections-index.js"
import { updateData  } from "../../utils/utils-index.js";


// =================================== add coupon =================================
/**
 * @api /coupon/add
 * @query => couponCode , userId from token
 * create coupon to all user can use it && Coupon has specific times to use
 * 1- check if coupon exist or not
 * 
 */


export const addCoupon = async (req,res,next)=>{
    const userId = req.user._id
    const {couponCode,couponAmount,couponType,from,till,Users,isEnabled} = req.body
   
    // check if coupon already exist
    const isCouponExist = await Coupon.findOne({couponCode})
    if(isCouponExist) return next(new ErrorClass("coupon already exist",400))
    
    // perpare coupon object and save
    const coupon = new Coupon({
        couponCode,
        couponAmount,
        couponType,
        from,
        till,
        addedBy:userId,
        isEnabled
    })
    // if admin want to add coupon to specific users
    if(Users){
        const userIds =  Users.map(u=>u.userId)
        const validateIds = await User.find({_id:{$in:userIds}})
        if (validateIds.length != Users.length) return next(new ErrorClass("user not found",404))
        // add user to coupon
        coupon.User.push(...Users)
    }
    await coupon.save()
    res.json({message:"coupon added successfully",coupon})
}

//================================== get all coupons =================================
/**
 * @api /coupon/list
 * get all coupon
 */
export const listCoupon = async (req,res,next)=>{
    const {isEnabled} = req.query
    const filter ={}
    // if admin want to get enabled or unenabled coupons
    if(isEnabled) filter.isEnabled = isEnabled === "true" ? true : false

    const allCoupons = await Coupon.find(filter)
    if(!allCoupons) return next(new ErrorClass("Not Coupons found",404))
    res.json(allCoupons)
}

// =================================== get  all enabled coupons =================================
/**
 * @api /coupon/get
 * get specific coupon by name
 */
export const getSpecificCouponByName = async (req,res,next)=>{
    const {couponCode} = req.query
    const allCoupons = await Coupon.findOne({couponCode})
    if(!allCoupons) return next(new ErrorClass("Not Coupons found",404))
    res.json(allCoupons)
}

// =================================== update coupon =================================
/**
 * @api /coupon/update
 * admin can update => couponCode , couponAmount , couponType , from , till , Users 
 * 
 */

export const updateCoupon = async (req,res,next)=>{
    // destruct userID and CouponId
    const userId = req.user._id
    const couponId = req.params.id

    const {couponCode,Users} = req.body

    // any admin can update coupon so we find coupoun by id 
    const coupon = await Coupon.findOne({_id:couponId})
    if(!coupon) return next(new ErrorClass("coupon not found",404))
    
    // update coupon data from body 
    const updateCoupon = updateData(coupon,req.body)

    // prepare coupon changes log object and save
    const couponChangelog = new CouponChangelog({
        couponId,
        updatedBy:userId,
    })
    // check if new coupon code exist or not 
    if (couponCode){
        const isCouponExist = await Coupon.findOne({couponCode})
        if(isCouponExist) return next(new ErrorClass("coupon already exist",400))
            updateCoupon.couponCode = couponCode
            couponChangelog.changes.push({
                fieldChanged:"couponCode",
                oldData:coupon.couponCode ,
                newData:updateCoupon.couponCode
            })
        
            
    }
    // validte dates from and till 
    if( req.body.till ){
        if(updateCoupon.from > updateCoupon.till) return next(new ErrorClass("till date must be greater than from date",400))
        couponChangelog.changes.push( {fieldChanged:"till",oldData:coupon.till ,newData:req.body.till })
    }
    if( req.body.from ){
        couponChangelog.changes.push( {fieldChanged:"from",oldData:coupon.from ,newData:req.body.from })
    }

    // if admin want to add users to coupon
    if(Users){
        const userIds =  Users.map(u=>u.userId)
        const validateIds = await User.find({_id:{$in:userIds}})
        if (validateIds.length != Users.length) return next(new ErrorClass("user not found",404))
        // add user to coupon
        coupon.User.push(...Users)
        couponChangelog.changes.push({
            fieldChanged:"Users",
            oldData:coupon.User ,
            newData:Users
         })
        // TODO: refactor to able admin to remove specific user from coupon
    }
   
    await updateCoupon.save()
   await couponChangelog.save()
    res.json({message:"coupon updated successfully",coupon})
}

// =================================== delete coupon =================================
/**
 * @api /coupon/delete
 * admin can delete coupon => soft delete
 */
export const deleteCoupon = async (req,res,next)=>{
    const userId = req.user._id
    const couponId = req.params.id
    const coupon = await Coupon.findOne({_id:couponId,addedBy:userId})
    if(!coupon) return next(new ErrorClass("coupon not found",404))
        
    coupon.isEnabled = false

    await coupon.save()
    res.json({message:"coupon deleted successfully",coupon})
}

// =================================== Disable Or Enable coupon =================================
/**
 * @api /coupon/active 
 * admin can disable or enable coupon
 * 
 */

export const disableOrEnableCoupon = async(req,res,next)=>{
    const userId = req.user._id
    const couponId = req.params.id
    const {isEnabled} = req.body
     
    const coupon = await Coupon.findOne({_id:couponId})
    if(!coupon) return next(new ErrorClass("coupon not found",404))

    if(coupon.isEnabled == isEnabled) return next(new ErrorClass("coupon already in this state",400))
    coupon.isEnabled = isEnabled

    // prepare coupon changes log object and save
    const couponChangelog = new CouponChangelog({
        couponId,
        updatedBy:userId,
    })
    couponChangelog.changes.push({
        fieldChanged:"isEnabled",
        oldData:coupon.isEnabled ,
        newData:isEnabled
    })

    await coupon.save()
    await couponChangelog.save()
    res.json({message:"coupon updated successfully",coupon})
}