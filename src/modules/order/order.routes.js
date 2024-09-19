import { Router } from "express";
import { authatication, authorizationMiddleware, errorHandler } from "../../middleware/middlewares-index.js";
import * as orderControllers from "./order.controller.js"



const orderRouters = Router()

orderRouters.post("/create",
    authatication(),
    authorizationMiddleware(["user"]),
   errorHandler(orderControllers.createOreder)
)
.put("/Cancel/:orderId",
    authatication(),
    authorizationMiddleware(["user"]),
    errorHandler(orderControllers.cancelOrder)
)
.post("/Stripe-Pay/:orderId",
    authatication(),
    authorizationMiddleware(["user"]),
    errorHandler(orderControllers.payWithStripe)
)
.post("/webhook",
    errorHandler(orderControllers.webhook)
)
.put("/deliver/:orderId",
    authatication(),
    authorizationMiddleware(["admin"]),
    errorHandler(orderControllers.deliverOrder)
)
export default orderRouters