import { ImageInfo } from "../models/imageInfo";
import { MapInfo } from "../models/mapInfo";

export const ErrorCode = {
  DataLoadFailed: 1,
  ImageLoadFailed: 2,
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface IPresenter {
  showMapInfo(info: MapInfo): string[];
  showGifInfo(info: ImageInfo): string[];
  resolveErrorMessage(errorCode: ErrorCode): string;
}
