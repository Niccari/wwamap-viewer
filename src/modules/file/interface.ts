export interface IFileLoader {
  loadAsync(file: File, type: string): Promise<string | ArrayBuffer>;
}
