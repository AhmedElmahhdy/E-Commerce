import { Router } from "express";
import { errorHandler , authatication } from "../../middleware/middlewares-index.js";
import * as cartControllers from "./cart.controllers.js"


const cartRouters = Router()

cartRouters.post("/add",
    authatication(),
    errorHandler(cartControllers.addToCart)
)
.patch("/update",
    authatication(),
    errorHandler(cartControllers.updateCart)
)
.put("/remove",
    authatication(),
    errorHandler(cartControllers.removeFromCart)
)
.get("/get",
    authatication(),
    errorHandler(cartControllers.getCart)
)

export default cartRouters