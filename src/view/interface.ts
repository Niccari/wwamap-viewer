import { ImageInfo } from "../models/imageInfo";
import { MapInfo } from "../models/mapInfo";

export enum TagId {
  MAP_UPLOADED = 1,
  GIF_UPLOADED = 2,
  LOADING = 3,
}

export interface IView {
  showMap(map: MapInfo): Promise<void>;
  showGif(dataUrl: string): Promise<ImageInfo>;
  enableDownloadButton(isEnable: boolean): void;
  showIfNeeded(id: TagId, isShow: boolean): void;
  showError(message: string): Promise<void>;
}
