import { Router } from "express";
import * as subCategoryController from "./sub-category.controllers.js"
import { authatication, authorizationMiddleware, cheackId, errorHandler } from "../../middleware/middlewares-index.js";
import { userRole , fileUploader  } from "../../utils/utils-index.js";




const subCategoryRoutes = Router()

subCategoryRoutes
// =========================== add sub-category ===========================
    .post('/add',
    authatication(),
    authorizationMiddleware(userRole.admin),
    fileUploader("sub-category").single("image"),
    errorHandler(subCategoryController.addSubCategory)
)

// =========================== get all sub-category =========================== 
.get('/get-all', 
    authatication(),
    authorizationMiddleware(userRole[userRole.user , userRole.admin]),
    errorHandler(subCategoryController.getAllSubCategory)
)

.delete('/delete/:id', 
    authatication(),
    authorizationMiddleware(userRole.admin),
    errorHandler(subCategoryController.deleteSubCategory)
)

// =========================== update sub-category ===========================
.put('/update/:id', 
    authatication(),
    authorizationMiddleware(userRole.admin),
    fileUploader("sub-category").single("image"),
    errorHandler( subCategoryController.updateSubCategory)
)

export default subCategoryRoutes