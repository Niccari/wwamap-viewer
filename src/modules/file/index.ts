import { IFileLoader } from "./interface";

export class FileLoader implements IFileLoader {
  loadAsync(file: File, type: string): Promise<string | ArrayBuffer> {
    if (file.type !== type) {
      return Promise.reject("Invalid file type");
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
  }
}
