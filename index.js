import express from "express";
import {config} from "dotenv";
import {connectDB} from "./DB/dbconnections.js";
import { globalResponse } from "./src/middleware/error-handling.js";
import modulesRouters from "./src/modules/modules-Routes.js";
import { disableCoupon,enableCoupon } from "./src/utils/crons.utiles.js";


const app = express();

config({ path: './config/dev.env' });
connectDB()

// cron jobs
disableCoupon()
enableCoupon()



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static("uploads"))

modulesRouters(app)

app.use(globalResponse)

app.listen(process.env.PORT,()=>console.log(`server is running on port ${process.env.PORT}`))