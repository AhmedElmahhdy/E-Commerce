import { Router } from "express";
import * as categoryControllers from "./category.controllers.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";
import { errorHandler } from "../../middleware/error-handling.js";


const categoryRouters = Router()

categoryRouters
// =========================== update category ===========================
.put('/update/:id',
    fileUploader("category","image"),
    categoryControllers.updateCategory
    //errorHandler(categoryControllers.updateCategory)
)
// =========================== add category ===========================
.post('/add', fileUploader("category","image"), 
 errorHandler( categoryControllers.addCategory)
)


categoryRouters.get('/get-all', categoryControllers.getAllCategory);

categoryRouters.delete('/delete/:id', categoryControllers.deleteCategory);

export default categoryRouters 