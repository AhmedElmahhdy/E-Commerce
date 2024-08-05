import userRouters from "./user.modules.js/user.routes.js"
import categoryRouters from "./category/category.routes.js"
import subCategoryRoutes from "./sub-category/sub-category.routes.js"
import brandRouters from "./brand/brand.routes.js"
import productRouters from "./product/product.routes.js"

const modulesRouters = (app) => {   

    app.use("/user",userRouters)
    app.use("/category",categoryRouters)
    app.use("/sub-category",subCategoryRoutes)
    app.use("/brand",brandRouters)
    app.use("/product",productRouters)
}


export default modulesRouters