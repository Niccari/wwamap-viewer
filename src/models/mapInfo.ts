export enum MapAttribute {
  x = 6,
  y = 7,
}

export interface MapItem {
  obj: number;
  bg: number;
}

export interface MapInfo {
  check: number;
  version: number;
  hpInit: number;
  strInit: number;
  defInit: number;
  goldInit: number;
  items: number[];
  hpMap: number;
  numBg: number;
  numObj: number;
  xInit: number;
  yInit: number;
  xGameover: number;
  yGameover: number;
  sizeMap: number;
  numMessage: number;
  map: MapItem[][];
  objAttrs: number[][];
  bgAttrs: number[][];
}
