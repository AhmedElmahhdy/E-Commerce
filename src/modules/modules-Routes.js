import userRouters from "./user/user.routes.js"
import categoryRouters from "./category/category.routes.js"
import subCategoryRoutes from "./sub-category/sub-category.routes.js"
import brandRouters from "./brand/brand.routes.js"
import productRouters from "./product/product.routes.js"
import addressRouters from "./address/addres.routes.js"
import cartRouters from "./cart/cart.routes.js"
import couponRouter from "./coupon/coupon.routes.js"
import orderRouters from "./order/order.routes.js"

const modulesRouters = (app) => {   

    app.use("/user",userRouters)
    app.use("/category",categoryRouters)
    app.use("/sub-category",subCategoryRoutes)
    app.use("/brand",brandRouters)
    app.use("/product",productRouters)
    app.use("/address",addressRouters)
    app.use("/cart",cartRouters)
    app.use("/coupon",couponRouter)
    app.use("/order",orderRouters)

}


export default modulesRouters