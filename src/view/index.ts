import { IMAGE_UNIT_WIDTH_PX } from "../consts";
import sleepMs from "../libs/sleep";
import { ImageInfo } from "../models/imageInfo";
import { MapAttribute, MapInfo } from "../models/mapInfo";
import { IView, TagId } from "./interface";

export const HtmlDefines = {
  UPLOADED_ID_GIF: "gif_uploaded",
  UPLOADED_ID_MAP: "dat_uploaded",
  INPUT_ID_GIF: "gif_file",
  INPUT_ID_MAP: "dat_file",
  GIF_SRC_PREVIEW: "gif_src_preview",

  IS_LOADING: "is_loading",
  ERROR_MESSAGE: "error_message",

  CANVAS_GIF_MAP_PREVIEW: "gif_map_preview",
} as const;
export type HtmlDefines = typeof HtmlDefines[keyof typeof HtmlDefines];

export class View implements IView {
  // eslint-disable-next-line class-methods-use-this
  public addEvents = (onGifFileSet: (file: File) => void, onDataFileSet: (file: File) => void): void => {
    View.addFileEvent(HtmlDefines.INPUT_ID_GIF, onGifFileSet);
    View.addFileEvent(HtmlDefines.INPUT_ID_MAP, onDataFileSet);
  };

  private static addFileEvent = (id: string, onFileRetrieved: (file: File) => void) => {
    const tag = document.getElementById(id);
    if (!tag) {
      return;
    }
    const retrieveFile = (e: Event): void => {
      const files = (e.target as HTMLInputElement | null)?.files;
      if (!files) {
        return;
      }
      onFileRetrieved(files[0]);
    };
    tag.addEventListener("change", retrieveFile);
    tag.addEventListener("dragstart", retrieveFile);
  };

  private static fetchImageTag = (): HTMLImageElement | null => {
    const img = document.getElementById(HtmlDefines.GIF_SRC_PREVIEW);
    return img as HTMLImageElement | null;
  };

  // eslint-disable-next-line class-methods-use-this
  public showMap = async (info: MapInfo): Promise<void> => {
    const img = View.fetchImageTag();
    const canvas = View.getCanvasById(HtmlDefines.CANVAS_GIF_MAP_PREVIEW);
    if (!img || !canvas) {
      return;
    }
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      return;
    }
    const { sizeMap } = info;

    canvas.width = sizeMap * IMAGE_UNIT_WIDTH_PX;
    canvas.height = sizeMap * IMAGE_UNIT_WIDTH_PX;

    const { map } = info;

    for (let y = 0; y < sizeMap; y += 1) {
      for (let x = 0; x < sizeMap; x += 1) {
        const { bg } = map[y][x];
        const { obj } = map[y][x];

        const bgAttr = info.bgAttrs[bg];
        const objAttr = info.objAttrs[obj];
        if (bgAttr && objAttr) {
          const bgX = bgAttr[MapAttribute.x];
          const bgY = bgAttr[MapAttribute.y];
          const objX = objAttr[MapAttribute.x];
          const objY = objAttr[MapAttribute.y];
          context.drawImage(
            img,
            bgX,
            bgY,
            IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX,
            x * IMAGE_UNIT_WIDTH_PX,
            y * IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX,
          );
          if (objX !== 0 || objY !== 0) {
            context.drawImage(
              img,
              objX,
              objY,
              IMAGE_UNIT_WIDTH_PX,
              IMAGE_UNIT_WIDTH_PX,
              x * IMAGE_UNIT_WIDTH_PX,
              y * IMAGE_UNIT_WIDTH_PX,
              IMAGE_UNIT_WIDTH_PX,
              IMAGE_UNIT_WIDTH_PX,
            );
          }
        }
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  public showGif = async (dataUrl: string): Promise<ImageInfo> =>
    new Promise((resolve, reject) => {
      const img = View.fetchImageTag();
      if (!img) {
        reject();
        return;
      }
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          dataUrl,
        });
      };
      img.src = dataUrl;
    });

  private static getCanvasById = (id: string): HTMLCanvasElement | null => {
    const canvas = document.getElementById(id);
    if (!canvas) {
      return null;
    }
    return canvas as HTMLCanvasElement;
  };

  private static resolveTag = (id: TagId): string => {
    switch (id) {
      case TagId.GIF_UPLOADED:
        return HtmlDefines.UPLOADED_ID_GIF;
      case TagId.MAP_UPLOADED:
        return HtmlDefines.UPLOADED_ID_MAP;
      case TagId.LOADING:
        return HtmlDefines.IS_LOADING;
      default:
        return "";
    }
  };

  // eslint-disable-next-line class-methods-use-this
  public showIfNeeded = (id: TagId, isShow: boolean): void => {
    const idStr = View.resolveTag(id);
    const tag = document.getElementById(idStr);
    if (!tag) {
      return;
    }
    const div = tag as HTMLElement;
    if (isShow) {
      div.style.display = "inline-block";
    } else {
      div.style.display = "none";
    }
  };

  // eslint-disable-next-line class-methods-use-this
  public showError = async (message: string): Promise<void> => {
    const tag = document.getElementById(HtmlDefines.ERROR_MESSAGE);
    if (!tag) {
      return;
    }
    tag.style.display = "block";
    tag.innerHTML = message;
    await sleepMs(3000);
    tag.style.display = "none";
  };
}
