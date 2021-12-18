import { IFileLoader } from "./interface";

class FileLoader implements IFileLoader {
  // eslint-disable-next-line class-methods-use-this
  public loadAsync = (file: File, type: string): Promise<string | ArrayBuffer> => {
    if (file.type !== type) {
      return Promise.reject(new Error("Invalid file type"));
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (!result) {
          reject();
        } else {
          resolve(result);
        }
      };
      if (type.includes("image")) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };
}

export default FileLoader;
