import { ImageInfo } from "../models/imageInfo";
import { MapInfo } from "../models/mapInfo";

export enum ErrorCode {
  DataLoadFailed = 1,
  ImageLoadFailed = 2,
}

export interface IPresenter {
  showMapInfo(info: MapInfo): string[];
  showGifInfo(info: ImageInfo): string[];
  resolveErrorMessage(errorCode: ErrorCode): string;
}
