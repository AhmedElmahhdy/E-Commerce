import { Product } from "../../../DB/collections/product.collection.js";
import slugify from "slugify";
import ErrorClass from "../../utils/Error-class.js";
import deleteFile from "../../utils/delete-file.js";
import axios from "axios";
import { Brand } from "../../../DB/collections/brand.collection.js";


// =========================== add product ===========================
export const addProduct = async (req, res, next) => {
    const { name, description, price,stock } = req.body;
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
        category,
        subCategory,
        brand,
    });
    if(req.files.length)
    for (const file of req.files) {
       product.image.urls.push (file.path);
    }
   
    // save product
   await product.save();
   res.json({ message: "Product created successfully"});
}

// =========================== get all product ===========================
export const getAllProduct = async (req, res, next) => {
    const products = await Product.find({});
    res.json({ products });
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