import { IFileLoader } from "../file/interface";
import { IImageLoader } from "./interface";

class ImageLoader implements IImageLoader {
  private fileLoader: IFileLoader;

  public constructor(fileLoader: IFileLoader) {
    this.fileLoader = fileLoader;
  }

  public loadDataUrlAsync = async (file: File): Promise<string> => {
    const dataUrl = await this.fileLoader.loadAsync(file, "image/gif");
    if (typeof dataUrl === "string") {
      return dataUrl;
    }
    return Promise.reject(new Error("Unsupported return type"));
  };
}

export default ImageLoader;
