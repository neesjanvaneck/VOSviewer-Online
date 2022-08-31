import Worker from 'workers/worker.js';

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

  terminateWorker() {
    this.worker.terminate();
    this.worker = new Worker();
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

  openJsonData(jsonFileOrUrlOrObject, resetParameters = false) {
    this.resetParameters = resetParameters;
    this.loadNewData = true;
    this.runLayout = false;
    this.runClustering = false;
    this.startParseJsonData({ jsonFileOrUrlOrObject });
  }

  openMapNetworkData(mapFileOrUrl, networkFileOrUrl, resetParameters = false) {
    this.resetParameters = resetParameters;
    this.loadNewData = true;
    this.runLayout = false;
    this.runClustering = false;
    this.startParseMapNetworkData({ mapFileOrUrl, networkFileOrUrl });
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

  startParseJsonData(options) {
    this.worker.postMessage({ type: 'start parse vosviewer-json data', options });
  }

  startParseMapNetworkData(options) {
    this.worker.postMessage({ type: 'start parse vosviewer-map-network data', options });
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
