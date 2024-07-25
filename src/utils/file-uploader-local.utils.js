import multer from "multer";
import fs from "fs";
import ErrorClass from "./Error-class.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export const fileUploader = (folderName,fileName) => {
    const fileFilter = (req, file, cb) => {
        // Check if the file is an image
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) {
          cb(null, true);
        } else {
          cb(new ErrorClass("Only images are allowed", 400), false);
        }
    }
    // Set up multer storage
    const storage = multer.diskStorage({
        // Set up the destination folder
        destination: (req, file, cb) => {
            const dir = `uploads/${folderName}`;
            fs.existsSync(dir) || fs.mkdirSync(dir);
            cb(null, dir);
        },
        // Set up the file name
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_" + Math.random() * 100 + "_" + file.originalname);
        },
    });
    const upload = multer({ storage ,fileFilter });
    return upload.single(fileName);
}
