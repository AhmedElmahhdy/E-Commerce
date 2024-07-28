import { Brand } from "../../../DB/collections/brand.collection.js";
import slugify from "slugify";
import ErrorClass from "../../utils/Error-class.js";
import deleteFile from "../../utils/delete-file.js";

// =========================== add brand ===========================
export const addBrand = async (req,res,next)=>{
    const {name , categoryId, subCategoryId} = req.body
    // check required fields 
   if(!name || !categoryId || !subCategoryId) return next(new ErrorClass("Name , Category and Sub-Category are required",400))
    // create slug
   const slug = slugify(name,{
       replacement: "-",
       lower: true 
   })
   // prepare brand object
   const brand = new Brand({
       name,
       logo:req.file.path,
       slug,
       category:categoryId,
       subCategory:subCategoryId
   })
   // save brand
   await brand.save()

   res.json({
       message:"Brand created successfully",
       brand
   })
}

// =========================== get all brand ===========================
export const getAllBrand = async (req,res,next)=>{
   const brands = await Brand.find({})
   res.json({brands})
}

// =========================== delete brand ===========================
export const deleteBrand = async (req,res,next)=>{
   const {id} = req.params
   const brand = await Brand.findById(id)
   if(!brand) return next(new ErrorClass("Brand not found",404))

       deleteFile(brand.logo,"brand")
       await Brand.deleteOne({_id:id})

   res.json({message:"Brand deleted successfully"})
}


// =========================== update brand ===========================
export const updateBrand = async (req,res,next)=>{
    const {id} = req.params
    const {name} = req.body
    console.log(name,req.file);
    const brand = await Brand.findById(id)
    if(!brand) return next(new ErrorClass("Brand not found",404))
    if (!name & !req.file) return next(new ErrorClass("Name or logo is required",400))
   if (name) {
        brand.name = name
        brand.slug = slugify(name,
             {
                 replacement: "-",
                  lower: true 
            })
    }
   if (req.file){ 
        deleteFile(brand.logo,"brand")
         brand.logo = req.file.path}

    await brand.save()
    res.json({
        message:"Brand updated successfully",
        brand
    })
}
    
    