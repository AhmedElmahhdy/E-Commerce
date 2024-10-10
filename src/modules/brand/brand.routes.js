import { Router } from "express";
import * as brandControllers from "./brand.controllers.js"
import { fileUploader, userRole } from "../../utils/utils-index.js";
import { authatication ,authorizationMiddleware,errorHandler } from "../../middleware/middlewares-index.js";




const brandRouters = Router()

brandRouters  
// =========================== add brand ===========================
.post('/add',
    authatication(),
    authorizationMiddleware(userRole.admin),
    fileUploader("brand").single("logo"),
    errorHandler(brandControllers.addBrand)
)
// =========================== get all brand ===========================
.get('/get-all', 
    authatication(),
    authorizationMiddleware(userRole[userRole.user , userRole.admin]),
    errorHandler(brandControllers.getAllBrand)
)
// =========================== delete brand ===========================
.delete('/delete/:id', 
    authatication(),
    authorizationMiddleware(userRole.admin),
    errorHandler(brandControllers.deleteBrand)
   
)

// =========================== update brand ===========================
.put('/update/:id',
    authatication(),
    authorizationMiddleware(userRole.admin),
    fileUploader("brand").single("logo"),
    errorHandler(brandControllers.updateBrand)
)

export default brandRouters