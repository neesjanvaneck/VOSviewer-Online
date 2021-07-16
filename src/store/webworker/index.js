/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-unresolved */
import Worker from 'worker-loader!workers/worker';

export default class State {
  constructor() {
    this.worker = new Worker();
    this.resetParameters = false;
    this.loadNewData = false;
    this.runLayout = false;
    this.runClustering = false;
  }

  addWorkerEventListener(callback) {
    this.worker.addEventListener("message", (event) => {
      callback(event.data);
    });
  }

  setResetParameters(resetParameters) {
    this.resetParameters = resetParameters;
  }

  setLoadNewData(loadNewData) {
    this.loadNewData = loadNewData;
  }

  setRunLayout(runLayout) {
    this.runLayout = runLayout;
  }

  setRunClustering(runClustering) {
    this.runClustering = runClustering;
  }

  openJsonFile(jsonFileOrUrl, resetParameters = false) {
    this.resetParameters = resetParameters;
    this.loadNewData = true;
    this.runLayout = false;
    this.runClustering = false;
    this.startParseJsonFile({ jsonFileOrUrl });
  }

  openMapNetworkFile(mapFileOrUrl, networkFileOrUrl, resetParameters = false) {
    this.resetParameters = resetParameters;
    this.loadNewData = true;
    this.runLayout = false;
    this.runClustering = false;
    this.startParseMapNetworkFile({ mapFileOrUrl, networkFileOrUrl });
  }

  updateNormalization(normalizationMethod) {
    this.worker.postMessage({ type: 'normalize network', options: { normalizationMethod } });
  }

  updateLayout(layoutParameters) {
    this.loadNewData = false;
    this.runLayout = true;
    this.runClustering = false;
    this.startRunLayout(layoutParameters);
  }

  updateClustering(clusteringParameters) {
    this.loadNewData = false;
    this.runLayout = false;
    this.runClustering = true;
    this.startRunClustering(clusteringParameters);
  }

  startParseJsonFile(options) {
    this.worker.postMessage({ type: 'start parse vosviewer-json file', options });
  }

  startParseMapNetworkFile(options) {
    this.worker.postMessage({ type: 'start parse vosviewer-map-network file', options });
  }

  startProcessData(options) {
    this.worker.postMessage({ type: 'start process data', options });
  }

  startHandleUnconnectedItems(options) {
    this.worker.postMessage({ type: 'start handle unconnected items', options });
  }

  startRunLayout(options) {
    this.worker.postMessage({ type: 'start run layout', options });
  }

  continueRunLayout() {
    this.worker.postMessage({ type: 'continue run layout' });
  }

  startRunClustering(options) {
    this.worker.postMessage({ type: 'start run clustering', options });
  }

  continueRunClustering() {
    this.worker.postMessage({ type: 'continue run clustering' });
  }
}
