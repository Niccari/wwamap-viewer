import { loadFileAsync } from "./fileLoader";

// eslint-disable-next-line import/prefer-default-export
export const loadImageUrlAsync = async (file: File): Promise<string> => {
  const dataUrl = await loadFileAsync(file, "image/gif");
  if (typeof dataUrl === "string") {
    return dataUrl;
  }
  return Promise.reject(new Error("Unsupported return type"));
};
