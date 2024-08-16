import { Router } from "express";
import * as couponControllers from "./coupon.controllers.js"
//import { errorHandler ,authorizationMiddleware,authatication} from "../../middleware/middlewares-index.js";
import { errorHandler , authatication ,authorizationMiddleware, validationMiddleware} from "../../middleware/middlewares-index.js";
import {  CouponSchema, updateCouponSchema ,disableOrEnableCouponSchema } from "./coupon.schema.js";

const couponRouter = Router()

couponRouter.post("/add",
    authatication(),
    authorizationMiddleware(["admin"]),
    validationMiddleware(CouponSchema),
    errorHandler(couponControllers.addCoupon)
)
.get("/list",
    authatication(),
    authorizationMiddleware(["admin"]),
    errorHandler(couponControllers.listCoupon)
)
.get("/get",
    authatication(),
    authorizationMiddleware(["admin"]),
    errorHandler(couponControllers.getSpecificCouponByName)
)
.put("/update/:id",
    authatication(),
    authorizationMiddleware(["admin"]),
    validationMiddleware(updateCouponSchema),
    errorHandler(couponControllers.updateCoupon)
)
.patch("/delete/:id",
    authatication(),
    authorizationMiddleware(["admin"]),
    errorHandler(couponControllers.deleteCoupon)
)
.patch("/disable-or-enable/:id",
    authatication(),
    authorizationMiddleware(["admin"]),
    validationMiddleware(disableOrEnableCouponSchema),
    errorHandler(couponControllers.disableOrEnableCoupon))

export default couponRouter