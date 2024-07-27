import { SubCategory } from "../../../DB/collections/sub-category.collections.js";
import ErrorClass from "../../utils/Error-class.js";

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