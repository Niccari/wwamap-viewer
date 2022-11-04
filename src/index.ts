import sleepMs from "./libs/sleep";
import { ImageInfo } from "./models/imageInfo";
import { MapInfo } from "./models/mapInfo";
import DataLoader from "./modules/data";
import FileLoader from "./modules/file";
import ImageLoader from "./modules/image";
import Presenter from "./presentation";
import { ErrorCode } from "./presentation/interface";
import { View } from "./view";
import { TagId } from "./view/interface";

interface State {
  mapInfo?: MapInfo;
  imageInfo?: ImageInfo;
}

const fileLoader = new FileLoader();
const dataLoader = new DataLoader(fileLoader);
const imageLoader = new ImageLoader(fileLoader);
const presenter = new Presenter();
const state: State = {
  mapInfo: undefined,
  imageInfo: undefined,
};
const view = new View();

const updateView = async () => {
  const { imageInfo, mapInfo } = state;
  const isMapUploaded = mapInfo !== undefined;
  const isGifUploaded = imageInfo !== undefined;
  const isMapReady = isMapUploaded && isGifUploaded;

  view.showIfNeeded(TagId.LOADING, true);
  view.showIfNeeded(TagId.MAP_UPLOADED, isMapUploaded);
  view.showIfNeeded(TagId.GIF_UPLOADED, isGifUploaded);
  if (isMapReady) {
    // ローディング表示を確実に入れるため一時待機
    await sleepMs(50);
    await view.showMap(mapInfo);
  }
  view.showIfNeeded(TagId.LOADING, false);
};

const updateState = (newState: State) => {
  state.imageInfo = newState.imageInfo;
  state.mapInfo = newState.mapInfo;

  updateView();
};

const onGifFileSet = async (file: File) => {
  const dataUrl = await imageLoader.loadDataUrlAsync(file).catch(() => {
    const message = presenter.resolveErrorMessage(ErrorCode.ImageLoadFailed);
    view.showError(message);
  });
  if (!dataUrl) {
    return;
  }
  view.showGif(dataUrl);
  updateState({
    ...state,
    imageInfo: await view.showGif(dataUrl),
  });
};

const onDataFileSet = async (file: File) => {
  const mapInfo = await dataLoader.loadAsync(file).catch(() => {
    const message = presenter.resolveErrorMessage(ErrorCode.DataLoadFailed);
    view.showError(message);
  });
  if (!mapInfo) {
    return;
  }
  updateState({
    ...state,
    mapInfo,
  });
};

view.addEvents(onGifFileSet, onDataFileSet);
