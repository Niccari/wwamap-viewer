export const MapAttribute = {
  x: 6,
  y: 7,
} as const;
export type MapAttribute = (typeof MapAttribute)[keyof typeof MapAttribute];

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
