import { Router } from "express";
import * as productControllers from "./product.controller.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";
import { errorHandler } from "../../middleware/error-handling.js";



const productRouters = Router()

productRouters
// =========================== add product ===========================
.post('/add',
    fileUploader("product").array("images"),
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