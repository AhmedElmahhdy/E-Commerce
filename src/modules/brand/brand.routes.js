import { Router } from "express";
import * as brandControllers from "./brand.controllers.js"
import { fileUploader } from "../../utils/file-uploader-local.utils.js";
import { errorHandler } from "../../middleware/error-handling.js";




const brandRouters = Router()

brandRouters  
// =========================== add brand ===========================
.post('/add',
    fileUploader("brand","logo"),
    errorHandler(brandControllers.addBrand)
)
// =========================== get all brand ===========================
.get('/get-all', 
    brandControllers.getAllBrand
)
// =========================== delete brand ===========================
.delete('/delete/:id', 
    brandControllers.deleteBrand
)

// =========================== update brand ===========================
.put('/update/:id',
    fileUploader("brand","logo"),
    errorHandler(brandControllers.updateBrand)
)

export default brandRouters