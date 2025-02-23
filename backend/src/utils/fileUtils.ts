import fs from "fs";


export const removeFile = async (filePath: string) => {
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  };
  
  