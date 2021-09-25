import { MapInfo, MapItem } from "../../models/mapInfo";
import { IDataLoader } from "./interface";
import { IFileLoader } from "../file/interface";

type BufferLoader = (position: number) => number;

export class DataLoader implements IDataLoader {
  private fileLoader: IFileLoader;

  constructor(fileLoader: IFileLoader) {
    this.fileLoader = fileLoader;
  }

  async loadAsync(file: File): Promise<MapInfo> {
    const buffer = await this.fileLoader.loadAsync(file, "");
    if (typeof buffer === "string") {
      return this.parseDataAsync(buffer);
    } else {
      return Promise.reject("Unsupported return type");
    }
  }

  private decode(result: string): string {
    let tmp = "";
    let k = 0;

    for (let i = 0; i < result.length - 3; i++) {
      if (result.charCodeAt(k) == result.charCodeAt(k + 1)) {
        const numRepeat = result.charCodeAt(k + 2) + 1;
        for (let j = 0; j < numRepeat; ++j) {
          tmp += result[k];
        }
        k = k + 3;
      } else {
        tmp += result[k];
        k = k + 1;
      }
    }
    return tmp;
  }

  private loadWord(buffer: string): BufferLoader {
    return (position: number) => {
      return buffer.charCodeAt(position) + buffer.charCodeAt(position + 1) * 256;
    };
  }

  private parseMapItem(position: number, sizeMap: number, bufferLoader: BufferLoader): MapItem[][] {
    const map: MapItem[][] = [];
    for (let y = 0; y < sizeMap; y++) {
      map[y] = [];
      for (let x = 0; x < sizeMap; x++) {
        const positionBg = position + 2 * (x + y * sizeMap);
        const positionObj = positionBg + 2 * (sizeMap * sizeMap);
        map[y][x] = {
          obj: bufferLoader(positionObj),
          bg: bufferLoader(positionBg),
        };
      }
    }
    return map;
  }

  private parseAttrs(position: number, attrMax: number, NumBg: number, bufferLoader: BufferLoader): number[][] {
    const attrs: number[][] = [];
    for (let y = 0; y < NumBg; y++) {
      attrs[y] = [];
      for (let x = 0; x < attrMax; x++) {
        attrs[y][x] = bufferLoader(position + 2 * (x + y * attrMax));
      }
    }
    return attrs;
  }

  private validateSize(sizeMap: number, numBg: number, numObj: number): boolean {
    return sizeMap <= 501 || numBg <= 200 || numObj <= 200;
  }

  private async parseDataAsync(buffer: string): Promise<MapInfo> {
    // datファイルのデータ位置(変数名はWinWwamk.cppより)
    const DATA_CHECK = 0; // チェック用正誤番号
    const DATA_VERSION = 2; // データver.
    const DATA_STATUS_INIT_HP = 10; // 初期HP
    const DATA_STATUS_INIT_STR = 12; // 初期攻撃力
    const DATA_STATUS_INIT_DEF = 14; // 初期防御力
    const DATA_STATUS_INIT_GOLD = 16; // 初期所持金
    const DATA_ITEM = 20; // アイテム情報(ここから12Byte分, 1Byteずつ)
    const DATA_STATUS_MAX_HP = 32; // 最大HP
    const DATA_BG_COUNT = 34; // 背景パーツ最大数
    const DATA_OBJ_COUNT = 36; // 物体パーツ最大数
    const DATA_CHARA_X = 38; // 主人公X座標
    const DATA_CHARA_Y = 40; // 主人公Y座標
    const DATA_OVER_X = 42; // ゲームオーバ時X座標
    const DATA_OVER_Y = 44; // ゲームオーバ時Y座標
    const DATA_MAP_SIZE = 46; // マップのサイズ(X,Y共通)
    const DATA_MES_NUMBER = 48; // メッセージデータの最後尾
    const DATA_MAP_BG_START = 90; // 物体パーツ開始

    const BG_ATTR_MAX = 60; // 背景パーツ属性の最大数
    const OBJ_ATTR_MAX = 60; // 物体パーツ属性の最大数

    const DATA_BYTES = 2;

    const decodedBuffer = this.decode(buffer);
    const bufferLoader = this.loadWord(decodedBuffer);

    const sizeMap = bufferLoader(DATA_MAP_SIZE);
    const numBg = bufferLoader(DATA_BG_COUNT);
    const numObj = bufferLoader(DATA_OBJ_COUNT);
    if (!this.validateSize(sizeMap, numBg, numObj)) {
      return Promise.reject("Invalid data size!");
    }

    // DATA_MAP_BG_STARTからみて、物体パーツと背景パーツの後からが物体属性データ
    const mapBgAttrStart = DATA_MAP_BG_START + 2 * DATA_BYTES * (sizeMap * sizeMap);
    const mapObjAttrStart = mapBgAttrStart + DATA_BYTES * (BG_ATTR_MAX * numBg);

    const map = this.parseMapItem(DATA_MAP_BG_START, sizeMap, bufferLoader);
    const bgAttrs = this.parseAttrs(mapBgAttrStart, BG_ATTR_MAX, numBg, bufferLoader);
    const objAttrs = this.parseAttrs(mapObjAttrStart, OBJ_ATTR_MAX, numObj, bufferLoader);

    // アイテムは1Byteずつ
    const items = Array.from(Array(12).keys()).map((i) => {
      return bufferLoader(DATA_ITEM + i) % 256;
    });

    return {
      check: bufferLoader(DATA_CHECK),
      version: bufferLoader(DATA_VERSION),
      hpInit: bufferLoader(DATA_STATUS_INIT_HP),
      strInit: bufferLoader(DATA_STATUS_INIT_STR),
      defInit: bufferLoader(DATA_STATUS_INIT_DEF),
      goldInit: bufferLoader(DATA_STATUS_INIT_GOLD),
      items,
      hpMap: bufferLoader(DATA_STATUS_MAX_HP),
      numBg,
      numObj,
      xInit: bufferLoader(DATA_CHARA_X),
      yInit: bufferLoader(DATA_CHARA_Y),
      xGameover: bufferLoader(DATA_OVER_X),
      yGameover: bufferLoader(DATA_OVER_Y),
      sizeMap,
      numMessage: bufferLoader(DATA_MES_NUMBER),
      map,
      bgAttrs,
      objAttrs,
    };
  }
}
