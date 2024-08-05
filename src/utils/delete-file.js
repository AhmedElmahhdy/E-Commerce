import fs from "fs"
import path from "path"

const deleteFile = (File , folderName) => {  
   if (Array.isArray(File)) {
       for (const file of File) {
        const fileName = file.split(`uploads\\${folderName}\\`)[1] 
        const resolve = path.resolve(`uploads/${folderName}`)
        const files = fs.readdirSync(resolve);
        for (const file of files) {
            if (file.endsWith(fileName)) {
                const filePath = path.join(resolve, file);
                fs.unlinkSync(filePath);
            }
        }
       }
   }
   else{
     const fileName = File.split(`uploads\\${folderName}\\`)[1] 
     const resolve = path.resolve(`uploads/${folderName}`)
     const files = fs.readdirSync(resolve);

   for (const file of files) {
   if (file.endsWith(fileName)) {
           const filePath = path.join(resolve, file); 
           console.log({
               filePath
           });
           fs.unlinkSync(filePath);
       }
   }
}
   
}

export default deleteFile