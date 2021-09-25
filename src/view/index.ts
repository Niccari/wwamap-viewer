import { IMAGE_UNIT_WIDTH_PX } from "../consts";
import { sleepMs } from "../libs/sleep";
import { ImageInfo } from "../models/imageInfo";
import { MapAttribute, MapInfo } from "../models/mapInfo";
import { IView, TagId } from "./interface";

enum HTML_ITEMS {
  UPLOADED_ID_GIF = "gif_uploaded",
  UPLOADED_ID_MAP = "dat_uploaded",
  INPUT_ID_GIF = "gif_file",
  INPUT_ID_MAP = "dat_file",
  GIF_SRC_PREVIEW = "gif_src_preview",

  IS_LOADING = "is_loading",
  ERROR_MESSAGE = "error_message",

  CANVAS_GIF_MAP_PREVIEW = "gif_map_preview",
  GIF_MAP_DOWNLOAD = "gif_map_download",
  GIF_MAP_DOWNLOAD_BUTTON = "git_map_download_button",
}

export class View implements IView {
  constructor(onGifFileSet: (file: File) => void, onDataFileSet: (file: File) => void) {
    this.addFileEvent(HTML_ITEMS.INPUT_ID_GIF, onGifFileSet);
    this.addFileEvent(HTML_ITEMS.INPUT_ID_MAP, onDataFileSet);
  }

  private addFileEvent(id: string, onFileRetrieved: (file: File) => void) {
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
  }

  private fetchImageTag(): HTMLImageElement | null {
    const img = document.getElementById(HTML_ITEMS.GIF_SRC_PREVIEW);
    return img as HTMLImageElement | null;
  }

  async showMap(info: MapInfo): Promise<void> {
    const img = this.fetchImageTag();
    const canvas = this.getCanvasById(HTML_ITEMS.CANVAS_GIF_MAP_PREVIEW);
    if (!img || !canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const sizeMap = info.sizeMap;

    canvas.width = sizeMap * IMAGE_UNIT_WIDTH_PX;
    canvas.height = sizeMap * IMAGE_UNIT_WIDTH_PX;

    const map = info.map;

    for (let y = 0; y < sizeMap; y++) {
      for (let x = 0; x < sizeMap; x++) {
        const bg = map[y][x].bg;
        const obj = map[y][x].obj;

        const bgAttr = info.bgAttrs[bg];
        const objAttr = info.objAttrs[obj];
        if (!bgAttr || !objAttr) {
          continue;
        }
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
          IMAGE_UNIT_WIDTH_PX
        );
        if (objX != 0 || objY != 0) {
          context.drawImage(
            img,
            objX,
            objY,
            IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX,
            x * IMAGE_UNIT_WIDTH_PX,
            y * IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX,
            IMAGE_UNIT_WIDTH_PX
          );
        }
      }
    }

    const downloadLink = document.getElementById(HTML_ITEMS.GIF_MAP_DOWNLOAD);
    if (downloadLink) {
      (downloadLink as HTMLLinkElement).href = canvas.toDataURL();
    }
  }

  async showGif(dataUrl: string): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const img = this.fetchImageTag();
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
  }

  private getCanvasById(id: string): HTMLCanvasElement | null {
    const canvas = document.getElementById(id);
    if (!canvas) {
      return null;
    }
    return canvas as HTMLCanvasElement;
  }

  enableDownloadButton(isEnable: boolean): void {
    const button = document.getElementById(HTML_ITEMS.GIF_MAP_DOWNLOAD_BUTTON);
    if (!button) {
      return;
    }
    (button as HTMLButtonElement).disabled = !isEnable;
  }

  private resolveTag(id: TagId): string {
    switch (id) {
      case TagId.GIF_UPLOADED:
        return HTML_ITEMS.UPLOADED_ID_GIF;
      case TagId.MAP_UPLOADED:
        return HTML_ITEMS.UPLOADED_ID_MAP;
      case TagId.LOADING:
        return HTML_ITEMS.IS_LOADING;
    }
  }

  showIfNeeded(id: TagId, isShow: boolean): void {
    const idStr = this.resolveTag(id);
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
  }

  async showError(message: string): Promise<void> {
    const tag = document.getElementById(HTML_ITEMS.ERROR_MESSAGE);
    if (!tag) {
      return;
    }
    tag.style.display = "block";
    tag.innerHTML = message;
    await sleepMs(3000);
    tag.style.display = "none";
  }
}
