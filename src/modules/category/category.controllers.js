import slugify from "slugify"
import { Category } from "../../../DB/collections/category.collections.js"
import ErrorClass from "../../utils/Error-class.js"
import deleteFile from "../../utils/delete-file.js"
import { SubCategory } from "../../../DB/collections/sub-category.collections.js"
import { Brand } from "../../../DB/collections/brand.collection.js"
import axios from "axios"

// =========================== add category ===========================

export const addCategory = async (req,res,next)=>{
     const {name} = req.body
     console.log(name,req.file);  
     // check required fields 
    if(!name) return next(new ErrorClass("Name is required",400))
     // check if category exist
    const isCategoryExist = await Category.findOne({name})
    if(isCategoryExist) return next(new ErrorClass("Category already exist",400))
     // create slug
    const slug = slugify(name,{
        replacement: "-",
        lower: true
    })
    // prepare category object
    
    const category = new Category({
        name,
        image:req.file.path,
        slug
    })
    // save category
    await category.save()

    res.json({
        message:"Category created successfully",
        category
    })
}
// =========================== get all category ===========================
export const getAllCategory = async (req,res,next)=>{
    const categories = await Category.find({})
    res.json({categories})
}
// =========================== delete category ===========================
export const deleteCategory = async (req,res,next)=>{
    const {id} = req.params
    const category = await Category.findById(id)
    if(!category) return next(new ErrorClass("Category not found",404))
        // delete category image 
        deleteFile(category.image,"category")
        // delete any sub-category belong to this category
        // two logic to delete any collection belong to this category
        // 1- first logic  
            // await SubCategory.deleteMany({category:id})
            // await Brand.deleteMany({category:id})
        // 2- second logic
        // nested delete => in delete category api call delete sub-categorty api that call delete brand api in side here 
        const isSubCategoryDeleted = await axios.delete(` ${req.protocol}://${req.headers.host}/sub-category/delete/${category._id}`)
        await Category.deleteOne({_id:id}) 

    res.json({message:"Category deleted successfully"})

}

// =========================== update category ===========================
export const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) return next(new ErrorClass("Category not found", 404));
    if (!name & !req.file) return next(new ErrorClass("Name or image is required", 400));
    // if name exists, update the name
   if (name){
        category.name = name;
        category.slug = slugify(name, {
            replacement: "-",
            lower: true
        });

   }
    // if req.file exists, delete the old image and update the image path
    if (req.file) {
        deleteFile(category.image, "category");
        category.image = req.file.path;
    }
    
    await category.save();
    res.json({ message: "Category updated successfully", category });
};
