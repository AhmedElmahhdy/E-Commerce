import userRouters from "./user.modules.js/user.routes.js"
import categoryRouters from "./category/category.routes.js"


const modulesRouters = (app) => {   

    app.use("/user",userRouters)
    app.use("/category",categoryRouters)
}


export default modulesRouters