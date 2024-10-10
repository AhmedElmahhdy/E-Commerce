import { Router } from "express";
import * as categoryControllers from "./category.controllers.js"
import { fileUploader, userRole } from "../../utils/utils-index.js";
import { authorizationMiddleware ,authatication, errorHandler} from "../../middleware/middleware-index.js";

const categoryRouters = Router()

categoryRouters
// =========================== add category ===========================
.post('/add', fileUploader("category").single("image"), 
    authatication(),
    authorizationMiddleware(userRole.admin),
    errorHandler( categoryControllers.addCategory)
)
// =========================== update category ===========================
.put('/update/:id',
    authatication(),
    authorizationMiddleware(userRole.admin),
    fileUploader("category").single("image"),
    errorHandler(categoryControllers.updateCategory)
)
// =========================== get all category ===========================
.get('/get-all',
    authatication(),
    authorizationMiddleware( userRole.user || userRole.admin ),
     categoryControllers.getAllCategory)
// =========================== delete category ===========================
.delete('/delete/:id',
    authatication(),
    authorizationMiddleware(userRole.admin),
    errorHandler( categoryControllers.deleteCategory));

export default categoryRouters 