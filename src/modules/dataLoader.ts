import { MapInfo, MapItem } from "../models/mapInfo";
import { loadFileAsync } from "./fileLoader";

type BufferLoader = (position: number) => number;

const stringToUint8Array = (rawText: string) => rawText.split("").map((r) => r.charCodeAt(0));

const decompressMapHex = (result: number[]): number[] => {
  const rawArray: number[] = [];

  for (let k = 0; k < result.length - 2; ) {
    const current = result[k];
    const next = result[k + 1];
    const numRepeat = result[k + 2];
    if (typeof current === "number" && typeof next === "number" && typeof numRepeat === "number") {
      if (current === next) {
        rawArray.push(...Array(numRepeat + 1).fill(current));
        k += 3;
      } else {
        rawArray.push(current);
        k += 1;
      }
    }
  }
  rawArray.push(...result.slice(result.length - 2));
  return rawArray;
};

const loadLittleEndianWord = (buffer: number[]) => (position: number) => {
  const low = buffer[position];
  const high = buffer[position + 1];
  if (typeof low === "number" && typeof high === "number") {
    return low + high * 256;
  }
  throw new Error(`invalid position: ${position}`);
};

const parseMapItem = (position: number, sizeMap: number, bufferLoader: BufferLoader): MapItem[][] =>
  new Array(sizeMap).fill(0).map((_, y) =>
    new Array(sizeMap).fill(0).map((__, x) => ({
      bg: bufferLoader(position + 2 * (x + y * sizeMap)),
      obj: bufferLoader(position + 2 * (x + y * sizeMap + sizeMap * sizeMap)),
    })),
  );

const parseAttrs = (position: number, attrMax: number, NumBg: number, bufferLoader: BufferLoader): number[][] =>
  new Array(NumBg)
    .fill(0)
    .map((_, y) => new Array(attrMax).fill(0).map((__, x) => bufferLoader(position + 2 * (x + y * attrMax))));

const validateSize = (sizeMap: number, numBg: number, numObj: number): boolean =>
  sizeMap <= 501 || numBg <= 200 || numObj <= 200;

export const parseDataAsync = (decodedArray: number[]): MapInfo => {
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

  const bufferLoader = loadLittleEndianWord(decodedArray);

  const sizeMap = bufferLoader(DATA_MAP_SIZE);
  const numBg = bufferLoader(DATA_BG_COUNT);
  const numObj = bufferLoader(DATA_OBJ_COUNT);

  if (!validateSize(sizeMap, numBg, numObj)) {
    throw new Error("Invalid data size!");
  }

  // DATA_MAP_BG_STARTからみて、物体パーツと背景パーツの後からが物体属性データ
  const mapBgAttrStart = DATA_MAP_BG_START + 2 * DATA_BYTES * (sizeMap * sizeMap);
  const mapObjAttrStart = mapBgAttrStart + DATA_BYTES * (BG_ATTR_MAX * numBg);

  const map = parseMapItem(DATA_MAP_BG_START, sizeMap, bufferLoader);
  const bgAttrs = parseAttrs(mapBgAttrStart, BG_ATTR_MAX, numBg, bufferLoader);
  const objAttrs = parseAttrs(mapObjAttrStart, OBJ_ATTR_MAX, numObj, bufferLoader);

  // アイテムは1Byteずつ
  const items = Array.from(Array(12).keys()).map((i) => bufferLoader(DATA_ITEM + i) % 256);

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
};

export const loadMapInfoAsync = async (file: File): Promise<MapInfo> => {
  const rawData = await loadFileAsync(file, "");
  if (typeof rawData !== "string") {
    throw new Error("Unsupported return type");
  }
  const rawArray = stringToUint8Array(rawData);
  const bufferLoader = decompressMapHex(rawArray);
  return parseDataAsync(bufferLoader);
};
