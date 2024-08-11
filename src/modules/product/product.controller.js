import { Product } from "../../../DB/collections/product.collection.js";
import slugify from "slugify";
import ErrorClass from "../../utils/Error-class.js";
import deleteFile from "../../utils/delete-file.js";
import axios from "axios";
import { Brand } from "../../../DB/collections/brand.collection.js";
import { discountType } from "../../utils/enums.utils.js";
import { calculatePrice } from "../../utils/calculate-price.utils.js";
import { ApiFeatures } from "../../utils/utils-index.js";



// =========================== add product ===========================
export const addProduct = async (req, res, next) => {
    const { name, description, price,stock,Discount,discountType } = req.body;
    const { category, subCategory, brand } = req.query;
     req.model ='product'
    // check required revelant category
    const brandData = await Brand.findOne({ _id: brand , subCategory, category });
        if (!brandData) {
            return next(new ErrorClass("Brand not found", 404));
        }
  
    if(!req.files) return next(new ErrorClass("Images is required", 400));
    // check required fields
    if (!name) return next(new ErrorClass("Name is required", 400));
    // create slug
    const slug = slugify(name, {
        replacement: "-",
        lower: true,
    });
    // prepare product object
    const product = new Product({
        name,
        description,
        price,
        stock, 
        slug,   
        Discount:{type:discountType,amount:Discount},
        category,
        subCategory,
        brand,
    });
    // add images
    if(req.files.length)
    for (const file of req.files) {
       product.image.urls.push (file.path);
    }

   
    // save product
   await product.save();
   res.json({ message: "Product created successfully", product });
}

// =========================== get all product ===========================
export const getAllProduct = async (req, res, next) => {
  
    const mongooseQuery = Product
    const ApiFeature = new ApiFeatures(req.query, mongooseQuery)
    .filter()
    .sort()
    .pagination()
    const product = await ApiFeature.mongooseQuery
    res.json({  product });
}
// =========================== delete product ===========================
export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return next(new ErrorClass("Product not found", 404));
    deleteFile(product.image.urls, "product");
    const isProductDeleted = await Product.deleteOne({ _id: id });
    if (!isProductDeleted) return next(new ErrorClass("Product not found", 404));
    res.json({ message: "Product deleted successfully" });
}
// =========================== update product ===========================

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * need to update => name . slug, description, price, stock, category, subCategory, brand , add discount , change image 
 */ 
export const updateProduct = async (req, res, next) => {
    const product = req.doc
    // update images if exist
    if(req.files){
        deleteFile(product.image.urls, "product")
        product.image.urls = [] // this line to remove old images from database
        console.log(product.image.urls);
        for (const file of req.files) {
            product.image.urls.push (file.path);
        }
        //ToDo:allow user to update one image only not all images
    }
    // update name and slug if exist
    if(req.body.name){
        product.name = req.body.name
        product.slug = slugify(req.body.name, {
            replacement: "-",
            lower: true
        });
    }
    // update description and overview if exist
    if(req.body.description) product.description = req.body.description
    if(req.body.overview) product.overview = req.body.overview
    // update stock if exist
    if(req.body.stock){
        // cheack first if stock is empty or not if not empty then old stock + new stock 
        if (product.stock ==0 ) {
            product.stock = req.body.stock
         }
         else product.stock = product.stock + req.body.stock
    }    
    // update price if exist
    if (req.body.price || req.body.Discount || req.body.discountType){
        const discount ={}
        discount.type = req.body.discountType || product.Discount.type
        discount.amount = req.body.Discount || product.Discount.amount
       
       const appliedPrice = calculatePrice(req.body.price,discount)
       if (appliedPrice) {
           product.appliedPrice = appliedPrice
       }
         product.price = req.body.price || product.price
         product.Discount = discount || product.Discount
    }
    await product.save()
    res.json({message:"updated successfully",product})
}