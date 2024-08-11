import { Router } from "express"
import { authatication, errorHandler, validationMiddleware } from "../../middleware/middlewares-index.js"

import * as addresControllers from "../address/address.controllers.js"
import { addAdressShema } from "./address.shema.js"
const addressRouters = Router() 

addressRouters.post("/add-address",
    errorHandler(authatication()),
    validationMiddleware(addAdressShema),
    errorHandler(addresControllers.addAdress)
)
.get("/list",
    errorHandler(authatication()),
    errorHandler(addresControllers.listAddress)
)
.patch("/delete/:addressId",
    errorHandler(authatication()),
    errorHandler(addresControllers.deleteAddress)

)
.put("/update/:id",
    errorHandler(authatication()),
    errorHandler(addresControllers.updateAddress)

)


export default addressRouters