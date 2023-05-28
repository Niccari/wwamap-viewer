import { parseDataAsync } from "./dataLoader";

// ignore prettier format
test("parse data", () => {
  const mapSize = 4;
  const numBg = 4;
  const numObj = 3;
  const mapInfo = parseDataAsync([
    0x34, 0x79,  // check
    0x1f, 0x00,  // version
    ...Array(6).fill(0x00),  // padding
    0x32, 0x00,  // HP init
    0x08, 0x00,  // Strength init
    0x05, 0x00,  // Defence init
    0x32, 0x00,  // Gold init
    0x00, 0x00,  // padding
    ...Array(12).fill(0x00), // 12 items
    0xf4, 0x01,  // HP Max
    numBg, 0x00,  // The number of backgrounds
    numObj, 0x00,  // The number of objects
    0x05, 0x00,  // The number of x init
    0x06, 0x00,  // The number of y init
    0x23, 0x00,  // The number of x gameover
    0x5c, 0x00,  // The number of y gameover
    mapSize, 0x00,  // map size (size x size)
    0x95, 0x04,  // The number of messages
    ...Array(40).fill(0x00),  // skip to the 90th bytes
    0x0a, 0x00, 0x0b, 0x00, 0x0c, 0x00, 0x0d, 0x00, ...Array(2 * 12).fill(0x70), // map of objects (2 x 2)
    0x1f, 0x00, 0x1e, 0x00, 0x1d, 0x00, 0x1c, 0x00, ...Array(2 * 12).fill(0x70), // map of backgrounds (2 x 2)
    0x10, 0x00, ...Array(2 * numBg * 60 - 2).fill(0x02),  // background attributes
    0x20, 0x00, ...Array(2 * numObj * 60 - 2).fill(0x04),  // object attributes
  ]);
  expect(mapInfo.check).toBe(0x34 + 0x79 * 256);
  expect(mapInfo.version).toBe(31);
  expect(mapInfo.hpInit).toBe(50);
  expect(mapInfo.strInit).toBe(8);
  expect(mapInfo.defInit).toBe(5);
  expect(mapInfo.goldInit).toBe(50);
  expect(mapInfo.items).toEqual(Array(12).fill(0));
  expect(mapInfo.hpMap).toBe(500);
  expect(mapInfo.numBg).toBe(numBg);
  expect(mapInfo.numObj).toBe(numObj);
  expect(mapInfo.xInit).toBe(5);
  expect(mapInfo.yInit).toBe(6);
  expect(mapInfo.xGameover).toBe(35);
  expect(mapInfo.yGameover).toBe(92);
  expect(mapInfo.sizeMap).toBe(4);
  expect(mapInfo.numMessage).toBe(1173);
  expect(mapInfo.map.flatMap((i) => i).map((i) => i.bg)).toEqual([10, 11, 12, 13, ...Array(12).fill(28784)]);
  expect(mapInfo.bgAttrs.flatMap((i) => i).map((i) => i)).toEqual([16, ...Array(numBg * 60 - 1).fill(514)]);
  expect(mapInfo.objAttrs.flatMap((i) => i).map((i) => i)).toEqual([32, ...Array(numObj * 60 - 1).fill(1028)]);
});
