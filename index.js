import express from "express";
import userRouters from "./src/modules/user.modules.js/user.routes.js";
import {config} from "dotenv";
import {connectDB} from "./DB/dbconnections.js";
import { globalResponse } from "./src/middleware/error-handling.js";

const app = express();

config();
connectDB()

app.use(express.json())

app.use("/user",userRouters)

app.use(globalResponse)

app.listen(process.env.PORT,()=>console.log(`server is running on port ${process.env.PORT}`))