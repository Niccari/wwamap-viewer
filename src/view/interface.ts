import { ImageInfo } from "../models/imageInfo";
import { MapInfo } from "../models/mapInfo";

export const TagId = {
  MAP_UPLOADED: 1,
  GIF_UPLOADED: 2,
  LOADING: 3,
} as const;
export type TagId = typeof TagId[keyof typeof TagId];

export interface IView {
  addEvents(onGifFileSet: (file: File) => void, onDataFileSet: (file: File) => void): void;
  showMap(map: MapInfo): Promise<void>;
  showGif(dataUrl: string): Promise<ImageInfo>;
  showIfNeeded(id: TagId, isShow: boolean): void;
  showError(message: string): Promise<void>;
}
