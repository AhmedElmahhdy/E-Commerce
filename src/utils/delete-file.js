import fs from "fs"
import path from "path"

const deleteFile = (File , folderName) => {  

const fileName = File.split(`uploads\\${folderName}\\`)[1] 
const __dirname = "E:\\Route\\E-commerce"
const uploadsPath = path.join(__dirname, "uploads", folderName);
const files = fs.readdirSync(uploadsPath);

for (const file of files) {
    if (file.endsWith(fileName)) {
        const filePath = path.join(uploadsPath, file); 
        fs.unlinkSync(filePath);
    }
}

}

export default deleteFile