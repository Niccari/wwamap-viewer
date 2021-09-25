export interface IImageLoader {
  loadDataUrlAsync(file: File, type: string): Promise<string>;
}
