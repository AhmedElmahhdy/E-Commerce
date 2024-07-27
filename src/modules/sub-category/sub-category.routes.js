import { Router } from "express";
import * as subCategoryController from "./sub-category.controllers.js"


const subCategoryRoutes = Router()

subCategoryRoutes.post('/add', subCategoryController.addSubCategory)

export default subCategoryRoutes