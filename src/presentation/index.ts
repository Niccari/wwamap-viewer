import { IMAGE_UNIT_WIDTH_PX } from "../consts";
import { ImageInfo } from "../models/imageInfo";
import { MapInfo } from "../models/mapInfo";
import { ErrorCode, IPresenter } from "./interface";

class Presenter implements IPresenter {
  // eslint-disable-next-line class-methods-use-this
  public showGifInfo(info: ImageInfo): string[] {
    const { width, height } = info;
    const numX = Math.floor(width / IMAGE_UNIT_WIDTH_PX);
    const numY = Math.floor(height / IMAGE_UNIT_WIDTH_PX);

    return [`横方向の画像数, 縦方向の画像数 = ${numX}, ${numY}`];
  }

  // eslint-disable-next-line class-methods-use-this
  public showMapInfo(mapInfo: MapInfo): string[] {
    return [
      `マップバージョン:${mapInfo.version / 10}`,
      `HP:${mapInfo.hpInit}/${mapInfo.hpMap}`,
      `攻撃力:${mapInfo.strInit}`,
      `防御力:${mapInfo.defInit}`,
      `所持金:${mapInfo.goldInit}`,
      `所持アイテム番号:${mapInfo.items.map((i) => i.toString()).join(",")}`,
      `MAX HP:${mapInfo.hpMap}`,
      `背景パーツ 最大数:${mapInfo.numBg}`,
      `物体パーツ 最大数:${mapInfo.numObj}`,
      `初期位置(x, y): (${mapInfo.xInit}, ${mapInfo.yInit})`,
      `ゲームオーバー位置(x, y): (${mapInfo.xGameover}, ${mapInfo.yGameover})`,
      `マップサイズ(w, h):${mapInfo.sizeMap}x${mapInfo.sizeMap}`,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  public resolveErrorMessage(errorCode: ErrorCode): string {
    switch (errorCode) {
      case ErrorCode.DataLoadFailed:
        return "マップファイルを読み込めませんでした。WWAで使用しているマップファイルかご確認ください。";
      case ErrorCode.ImageLoadFailed:
        return "画像ファイルを読み込めませんでした。WWAで使用している画像ファイルかご確認ください。";
      default:
        return "";
    }
  }
}

export default Presenter;
