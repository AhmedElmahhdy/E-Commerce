import {Address} from "../../../DB/collections/address.collection.js"
import ErrorClass from "../../utils/Error-class.js"
import { updateData } from "../../utils/update-data-from-body.js"


// =========================== Add Address ==========================
export const addAdress = async (req,res,next)=>{
    const id= req.user._id
    const {country , city,postalcode,street,buildingNumber, flootNumber , addressLabel ,setDefault}=req.body
    // prepare address object 
    const address = new Address({
      userId:id,
      country,
      city,
      street,
      buildingNumber,
      flootNumber ,
      addressLabel,
      postalcode,
      isDefault :[true,false].includes(setDefault)? setDefault : false
    })
    // cheack if user make this address is default
    if (address.isDefault){
        await Address.updateOne({userId:id,isDefault:true},{isDefault:false})
    }
   
   await address.save()


  res.status(201).json({message:"address added succseully",address})
}


// =========================== get all addresses ====================
export const listAddress = async (req,res,next)=>{
    const userId = req.user._id
    
    const allAddresses = await Address.find({userId,isMarkedDelete:false})
    if(!allAddresses) return new ErrorClass("Not any Address Exist ",404)
    
    res.json(allAddresses)
}

// =========================== delete address =========================
export const deleteAddress = async (req,res,next)=>{
    const id = req.user._id
    const addressId = req.params.addressId
    console.log(addressId);

    const isDelete = await Address.findByIdAndUpdate(
        {_id:addressId,userId:id},
        {isMarkedDelete:true,isDefault:false},
         {new:true}
    )

    res.json("Deleted successfully")
}

// =========================== update address =========================
export const updateAddress = async (req,res,next)=>{
    const userId = req.user._id
    const addressId = req.params.id 
    const {setDefault}=req.body
    
    const address = await Address.findOne({_id:addressId,userId,isMarkedDelete:false})

    if(!address) return next (new ErrorClass("Address Not Exist",404,"Address Not Exist"))
    // to save all date come in body
    const updatedAddressDoc = updateData(address,req.body)
    // cheack is user want to set this address to be default 
    if (setDefault){
        updatedAddressDoc.isDefault = [true,false].includes(setDefault)? setDefault : false
        await Address.updateOne({userId:id,isDefault:true},{isDefault:false})
    }
  
   await updatedAddressDoc.save()

    res.json({message:"updated successfully",
        updatedAddressDoc
    })

}