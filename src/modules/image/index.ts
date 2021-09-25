import { IFileLoader } from "../file/interface";
import { IImageLoader } from "./interface";

export class ImageLoader implements IImageLoader {
  private fileLoader: IFileLoader;

  constructor(fileLoader: IFileLoader) {
    this.fileLoader = fileLoader;
  }

  async loadDataUrlAsync(file: File): Promise<string> {
    const dataUrl = await this.fileLoader.loadAsync(file, "image/gif");
    if (typeof dataUrl === "string") {
      return dataUrl;
    } else {
      return Promise.reject("Unsupported return type");
    }
  }
}
