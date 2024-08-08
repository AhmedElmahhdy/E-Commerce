import { Router } from "express";
import * as productControllers from "./product.controller.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";
import { errorHandler } from "../../middleware/error-handling.js";
import { cheackId } from "../../middleware/finders.middleware.js";
import { Product } from "../../../DB/collections-index.js";



const productRouters = Router()

productRouters
// =========================== add product ===========================
.post('/add',
    fileUploader("product").array("images"),
    // cheackId(Brand),
    errorHandler(productControllers.addProduct) 
)
// =========================== get all product ===========================
.get('/get-all', 
    productControllers.getAllProduct
)
// =========================== delete product ===========================
.delete('/delete/:id', 
    productControllers.deleteProduct
)
// =========================== update product ===========================
.put('/update/:id',
    cheackId(Product),
    fileUploader("product").array("images"),
    errorHandler(productControllers.updateProduct)
)

export default productRouters