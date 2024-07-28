import { Router } from "express";
import * as subCategoryController from "./sub-category.controllers.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";


const subCategoryRoutes = Router()

subCategoryRoutes
// =========================== add sub-category ===========================
    .post('/add',
    fileUploader("sub-category","image"),
    subCategoryController.addSubCategory
)

// =========================== get all sub-category ===========================
.get('/get-all', 
    subCategoryController.getAllSubCategory
)

.delete('/delete/:id', 
    subCategoryController.deleteSubCategory
)

// =========================== update sub-category ===========================
.put('/update/:id', 
    fileUploader("sub-category","image"),
    subCategoryController.updateSubCategory
)

export default subCategoryRoutes