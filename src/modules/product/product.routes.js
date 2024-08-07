import { Router } from "express";
import * as productControllers from "./product.controller.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";
import { errorHandler } from "../../middleware/error-handling.js";
import { cheackId } from "../../middleware/finders.middleware.js";
import { Brand } from "../../../DB/collections/brand.collection.js";



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

export default productRouters