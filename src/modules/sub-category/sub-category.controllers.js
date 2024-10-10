import { SubCategory } from "../../../DB/collections/sub-category.collections.js";
import slugify from "slugify"
import ErrorClass from "../../utils/Error-class.js";
import deleteFile from "../../utils/delete-file.js";
import axios from "axios";


// =========================== add sub-category ===========================
export const addSubCategory = async (req,res,next)=>{
    const {name ,categoryId} = req.body
    req.model = 'sub-category'

// check required fields 
   if(!name) return next(new ErrorClass("Name is required",400))
// create slug
   const slug = slugify(name,{
       replacement: "-",
       lower: true 
   })
   // prepare category object
   const subCategory = new SubCategory({
       name,
       image:req.file.path,
       slug,
       category:categoryId
   })
   // save category
   await subCategory.save()

   res.json({
       message:"Sub-Category created successfully",
       subCategory
   })
}

// =========================== get all sub-category ===========================
export const getAllSubCategory = async (req,res,next)=>{
   const subCategories = await SubCategory.find({})
   res.json({subCategories})
}

// =========================== delete sub-category ===========================
export const deleteSubCategory = async (req,res,next)=>{
   const {id} = req.params
   const subCategory = await SubCategory.findOne({_id:id})
   if(!subCategory) return next(new ErrorClass("Sub-Category not found",404))

       deleteFile(subCategory.image,"sub-category")
       // delete any brand belong to this sub-category
      // const isBrandDeleted = await axios.delete(` ${req.protocol}://${req.headers.host}/brand/delete/${subCategory._id}`)
       await SubCategory.deleteOne(subCategory._id)

   res.json({ message:"Sub-Category deleted successfully"}) 


   }

// =========================== update sub-category ===========================
export const updateSubCategory = async (req, res, next) => {
   const { id } = req.params;
   const { name } = req.body;

   const subCategory = await SubCategory.findById(id);
   if (!subCategory) return next(new ErrorClass("Sub-Category not found", 404));
   
   if(name) 
    {   
        const checkNameExist = await SubCategory.findOne({ name });
        if(checkNameExist) return next(new ErrorClass("Sub-Category Name already exist", 400));
        subCategory.name = name 
        subCategory.slug = slugify(name, {
            replacement: "-",
            lower: true
        })
    }
    // if req.file exists, delete the old image and update the image path
   if(req.file) {
        deleteFile(subCategory.image,"sub-category");
        subCategory.image = req.file.path
    }

   if (!name & !req.file) return next(new ErrorClass("Name or Image is required", 400));
   await subCategory.save();

    res.json({
        message:"Sub-Category updated successfully",
        subCategory
    })

}