import { SubCategory } from "../../../DB/collections/sub-category.collections.js";
import slugify from "slugify"
import ErrorClass from "../../utils/Error-class.js";
import deleteFile from "../../utils/delete-file.js";

// =========================== add sub-category ===========================
export const addSubCategory = async (req,res,next)=>{
    const {name ,categoryId} = req.body
    console.log(name,categoryId);
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
   const subCategory = await SubCategory.findById(id)
   if(!subCategory) return next(new ErrorClass("Sub-Category not found",404))

       deleteFile(subCategory.image,"sub-category")
       await SubCategory.deleteOne({_id:id})

   res.json({message:"Sub-Category deleted successfully"})


   }

// =========================== update sub-category ===========================
export const updateSubCategory = async (req, res, next) => {
   const { id } = req.params;
   const { name } = req.body;

   const subCategory = await SubCategory.findById(id);
   if (!subCategory) return next(new ErrorClass("Sub-Category not found", 404));
   
   if(name) 
    {
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