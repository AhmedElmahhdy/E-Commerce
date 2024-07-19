import express from "express";
import {config} from "dotenv";
import {connectDB} from "./DB/dbconnections.js";

const app = express();

config();
connectDB()

app.listen(process.env.PORT,()=>console.log(`server is running on port ${process.env.PORT}`))