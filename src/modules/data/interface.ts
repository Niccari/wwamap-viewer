import { MapInfo } from "../../models/mapInfo";

export interface IDataLoader {
  loadAsync(file: File, type: string): Promise<MapInfo>;
}
