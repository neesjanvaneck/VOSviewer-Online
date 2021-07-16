/* eslint-disable no-bitwise */
import { parse } from 'papaparse';
import _findIndex from 'lodash/findIndex';
import _isNull from 'lodash/isNull';
import _each from 'lodash/each';
import _uniq from 'lodash/uniq';
import _concat from 'lodash/concat';
import _cloneDeep from 'lodash/cloneDeep';
import _isObject from 'lodash/isObject';
import _isPlainObject from 'lodash/isPlainObject';
import _keys from 'lodash/keys';
import _reduce from 'lodash/reduce';

import { NetworkNormalizer, LINLOG_MODULARITY } from 'utils/networkanalysis/NetworkNormalizer';
import { LayoutCreator } from 'utils/networkanalysis/LayoutCreator';
import { ClusteringCreator } from 'utils/networkanalysis/ClusteringCreator';
import { minNItems, fileTypeKeys, errorKeys, processTypes, parameterKeys } from 'utils/variables';

import { getFileError, getFileReaderError, getJsonFileError, getMapFileError, getNetworkFileError } from 'utils/errors';
import { getItemWithTransformedKeysAndValues } from 'utils/helpers';

const clusteringCreator = new ClusteringCreator();
const layoutCreator = new LayoutCreator();
const networkNormalizer = new NetworkNormalizer();

let layoutRandomStart = 0;
let clusterRandomStart = 0;

self.addEventListener("message", event => {
  const { type, options } = event.data;
  switch (type) {
    case 'normalize network':
      networkNormalizer.performNormalization(options.normalizationMethod);
      break;
    case 'start parse vosviewer-json file':
      _parseJsonFile(options.jsonFileOrUrl);
      break;
    case 'start parse vosviewer-map-network file':
      _parseMapNetworkFile(options.mapFileOrUrl, options.networkFileOrUrl);
      break;
    case 'start process data': {
      self.postMessage({
        type: 'update loading screen',
        data: { processType: processTypes.PROCESSING_DATA },
      });
      const { nNodes, edges, edgeWeights, itemIdToIndex } = _prepareNetworkData(options.mapData, options.networkData);
      networkNormalizer.init(nNodes, edges, edgeWeights);
      const nItemsNetwork = networkNormalizer.unnormalizedNetwork.getNNodes();
      const networkComponents = networkNormalizer.unnormalizedNetwork.identifyComponents();
      const nComponents = networkComponents.getNClusters();
      const nItemsLargestComponent = networkNormalizer.unnormalizedNetwork.createSubnetwork(networkComponents, 0).getNNodes();
      const hasUnconnectedItems = nComponents > 1 && nItemsLargestComponent >= minNItems;
      if (hasUnconnectedItems) networkNormalizer.setNetworkComponents(networkComponents);
      self.postMessage({
        type: 'end process data',
        data: {
          itemIdToIndex,
          hasUnconnectedItems,
          nItemsNetwork: hasUnconnectedItems && nItemsNetwork,
          nItemsLargestComponent: hasUnconnectedItems && nItemsLargestComponent,
        },
      });
      break;
    }
    case 'start handle unconnected items': {
      const itemsToShow = options.unconnectedItemsDialogChoice === 'yes' ? _removeUnconnectedItems(networkNormalizer.getNetworkComponents(), 0) : undefined;
      if (itemsToShow) {
        const filteredMapData = options.mapData.filter((d, i) => itemsToShow.includes(i));
        const filteredNetworkData = options.networkData.filter(d => itemsToShow.includes(options.itemIdToIndex[d[0]]) && itemsToShow.includes(options.itemIdToIndex[d[1]]));
        const { nNodes, edges, edgeWeights, itemIdToIndex } = _prepareNetworkData(filteredMapData, filteredNetworkData);
        networkNormalizer.init(nNodes, edges, edgeWeights);
        self.postMessage({
          type: 'end handle unconnected items',
          data: { mapData: filteredMapData, networkData: filteredNetworkData, itemIdToIndex },
        });
      } else {
        self.postMessage({
          type: 'end handle unconnected items',
          data: {},
        });
      }
      break;
    }
    case 'start run layout':
      self.postMessage({
        type: 'update loading screen',
        data: { processType: processTypes.RUNNING_LAYOUT, progressValue: 0 },
      });
      layoutRandomStart = 0;
      layoutCreator.init(networkNormalizer.normalizedNetwork, options);
      self.postMessage({
        type: 'update run layout progress',
        data: { progressValue: 100 * 0 / layoutCreator.nRandomStarts },
      });
      break;
    case 'continue run layout':
      if (layoutRandomStart < layoutCreator.nRandomStarts) {
        layoutCreator.performRandomStart();
        layoutRandomStart += 1;
        self.postMessage({
          type: 'update run layout progress',
          data: { progressValue: 100 * layoutRandomStart / layoutCreator.nRandomStarts },
        });
      } else {
        layoutCreator.performPostProcessing();
        self.postMessage({
          type: 'end run layout',
          data: { bestLayout: layoutCreator.bestLayout },
        });
      }
      break;
    case 'start run clustering':
      self.postMessage({
        type: 'update loading screen',
        data: { processType: processTypes.RUNNING_CLUSTERING, progressValue: 0 },
      });
      clusterRandomStart = 0;
      clusteringCreator.init(networkNormalizer.normalizedNetwork, options, networkNormalizer.normalizationMethod === LINLOG_MODULARITY);
      self.postMessage({
        type: 'update run clustering progress',
        data: { progressValue: 100 * 0 / clusteringCreator.nRandomStarts },
      });
      break;
    case 'continue run clustering':
      if (clusterRandomStart < clusteringCreator.nRandomStarts) {
        clusteringCreator.performRandomStart();
        clusterRandomStart += 1;
        self.postMessage({
          type: 'update run clustering progress',
          data: { progressValue: 100 * clusterRandomStart / clusteringCreator.nRandomStarts },
        });
      } else {
        clusteringCreator.performPostProcessing();
        const bestClustering = {
          cluster: [],
          nClusters: clusteringCreator.bestClustering.nClusters,
          nNodes: clusteringCreator.bestClustering.nNodes
        };
        if (clusteringCreator.mergeSmallClusters) {
          bestClustering.cluster = clusteringCreator.bestClustering.cluster;
        } else {
          const nItemsPerCluster = clusteringCreator.bestClustering.getNNodesPerCluster();
          for (let i = 0; i < bestClustering.nNodes; i++) {
            const cluster = clusteringCreator.bestClustering.cluster[i];
            bestClustering.cluster.push(nItemsPerCluster[cluster] >= clusteringCreator.minClusterSize ? cluster : null);
          }
          let nClusters = 0;
          for (let i = 0; i < nItemsPerCluster.length; i++) {
            if (nItemsPerCluster[i] >= clusteringCreator.minClusterSize) {
              nClusters += 1;
            }
          }
          bestClustering.nClusters = nClusters;
        }
        self.postMessage({
          type: 'end run clustering',
          data: { bestClustering },
        });
      }
      break;
    default:
      break;
  }
});

function _parseJsonFile(jsonFileOrUrl) {
  if (jsonFileOrUrl) {
    self.postMessage({
      type: 'update loading screen',
      data: { processType: processTypes.READING_JSON_FILE },
    });
    if (jsonFileOrUrl instanceof File) {
      const reader = new FileReader();
      reader.readAsText(jsonFileOrUrl, 'UTF-8');
      reader.onload = event => {
        _parseJsonData(event.target.result);
      };
      reader.onerror = () => {
        const fileError = getFileReaderError(reader.error, fileTypeKeys.VOSVIEWER_JSON_FILE);
        self.postMessage({
          type: 'end parse vosviewer-json file',
          data: { fileError },
        });
      };
    } else {
      fetch(jsonFileOrUrl)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Not Found');
            } else {
              throw new Error(response.statusText);
            }
          }
          return response.text();
        })
        .then(text => {
          _parseJsonData(text);
        })
        .catch(error => {
          const fileError = getFileReaderError(error, fileTypeKeys.VOSVIEWER_JSON_FILE);
          self.postMessage({
            type: 'end parse vosviewer-json file',
            data: { fileError },
          });
        });
    }
  }
}

function _parseJsonData(text) {
  let fileError;
  let jsonData = {};
  let mapData = [];
  let networkData = [];

  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    data = undefined;
  }
  if (data && data.network && (data.network.items || data.network.links)) {
    jsonData = _cloneDeep(data) || {};
    if (jsonData.config && _isPlainObject(jsonData.config.parameters)) {
      jsonData.config.parameters = _reduce(jsonData.config.parameters, (result, value, key) => {
        if (Object.values(parameterKeys).includes(key)) result[key] = value;
        return result;
      }, {});
    }

    const items = (data.network.items || []).map(item => {
      if (_isObject(item.weights)) {
        _keys(item.weights).forEach(key => {
          item[`weight<${key}>`] = item.weights[key];
        });
      }
      delete item.weights;
      if (_isObject(item.scores)) {
        _keys(item.scores).forEach(key => {
          item[`score<${key}>`] = item.scores[key];
        });
      }
      delete item.scores;
      return getItemWithTransformedKeysAndValues(item);
    });
    const itemPrototype = {};
    items.forEach(item => {
      _keys(item).forEach((key) => {
        itemPrototype[key] = null;
      });
    });
    mapData = items.map(item => ({ ...itemPrototype, ...item }));

    const links = (data.network.links || []);
    const linkPrototype = {};
    links.forEach(link => {
      _keys(link).forEach((key) => {
        linkPrototype[key] = null;
      });
    });
    networkData = links.map(link => ([link.source_id, link.target_id, link.strength, link.url, link.description]));

    const parseResultsMapData = { data: mapData, meta: { fields: Object.values(_keys(itemPrototype)) } };
    const parseResultsNetworkData = { data: networkData, meta: { fields: Object.values(_keys(linkPrototype)) } };
    fileError = getJsonFileError(parseResultsMapData, parseResultsNetworkData);

    if (mapData.length === 0) {
      const itemIds1 = networkData.map(d => d[0]);
      const itemIds2 = networkData.map(d => d[1]);
      const uniqueItemIds = _uniq(_concat(itemIds1, itemIds2));
      uniqueItemIds.sort();
      mapData = uniqueItemIds.map(d => ({ id: d }));
    }
  } else if (text === "") {
    fileError = getFileError(errorKeys.FILE_EMPTY, fileTypeKeys.VOSVIEWER_JSON_FILE);
  } else {
    fileError = getFileError(errorKeys.INVALID_JSON_DATA_FORMAT, fileTypeKeys.VOSVIEWER_JSON_FILE);
  }
  self.postMessage({
    type: 'end parse vosviewer-json file',
    data: { fileError, jsonData, mapData, networkData },
  });
}

function _parseMapNetworkFile(mapFileOrUrl, networkFileOrUrl) {
  let fileError;
  let mapData = [];
  let networkData = [];

  if (mapFileOrUrl) {
    self.postMessage({
      type: 'update loading screen',
      data: { processType: processTypes.READING_MAP_FILE },
    });
    parse(mapFileOrUrl, {
      header: true,
      download: !(mapFileOrUrl instanceof File),
      // skipEmptyLines: true,
      delimitersToGuess: ['\t', ';', ','],
      // dynamicTyping: true,
      error: error => {
        fileError = getFileReaderError(error, fileTypeKeys.VOSVIEWER_MAP_FILE);
        self.postMessage({
          type: 'end parse vosviewer-map-network file',
          data: { fileError },
        });
      },
      complete: parseResults => {
        if (parseResults.errors.length) {
          const emptyLastLineErrorIndex = _findIndex(parseResults.errors, error => error.row === parseResults.data.length - 1 && error.code === 'TooFewFields');
          if (emptyLastLineErrorIndex !== -1) {
            parseResults.errors.splice(emptyLastLineErrorIndex, 1);
            parseResults.data.pop();
          }
        }
        parseResults.data = (parseResults.data || []).map(item => getItemWithTransformedKeysAndValues(item));
        mapData = parseResults.data;
        fileError = getMapFileError(parseResults, networkFileOrUrl != null);
        if (!fileError && networkFileOrUrl) {
          self.postMessage({
            type: 'update loading screen',
            data: { processType: processTypes.READING_NETWORK_FILE },
          });
          parse(networkFileOrUrl, {
            header: false,
            download: !(networkFileOrUrl instanceof File),
            // skipEmptyLines: true,
            delimitersToGuess: ['\t', ';', ','],
            dynamicTyping: true,
            error: error => {
              fileError = getFileReaderError(error, fileTypeKeys.VOSVIEWER_NETWORK_FILE);
              self.postMessage({
                type: 'end parse vosviewer-map-network file',
                data: { fileError },
              });
            },
            complete: parseResults => {
              if (parseResults.data.length) {
                const lastLine = parseResults.data[parseResults.data.length - 1];
                if (lastLine.length === 1 && (lastLine[0] === '' || _isNull(lastLine[0]))) {
                  parseResults.data.pop();
                }
              }
              networkData = parseResults.data;
              fileError = getNetworkFileError(parseResults, mapData);
              self.postMessage({
                type: 'end parse vosviewer-map-network file',
                data: { fileError, mapData, networkData },
              });
            }
          });
        } else {
          self.postMessage({
            type: 'end parse vosviewer-map-network file',
            data: { fileError, mapData, networkData },
          });
        }
      }
    });
  } else if (networkFileOrUrl) {
    self.postMessage({
      type: 'update loading screen',
      data: { processType: processTypes.READING_NETWORK_FILE },
    });
    parse(networkFileOrUrl, {
      header: false,
      download: !(networkFileOrUrl instanceof File),
      // skipEmptyLines: true,
      delimitersToGuess: ['\t', ';', ','],
      dynamicTyping: true,
      error: error => {
        fileError = getFileReaderError(error, fileTypeKeys.VOSVIEWER_NETWORK_FILE);
        self.postMessage({
          type: 'end parse vosviewer-map-network file',
          data: { fileError, mapData, networkData },
        });
      },
      complete: results => {
        if (results.data.length) {
          const lastLine = results.data[results.data.length - 1];
          if (lastLine.length === 1 && (lastLine[0] === '' || _isNull(lastLine[0]))) {
            results.data.pop();
          }
        }
        networkData = results.data;
        fileError = getNetworkFileError(results, mapData);
        if (!fileError) {
          const itemIds1 = networkData.map(link => link[0]);
          const itemIds2 = networkData.map(link => link[1]);
          const uniqueItemIds = _uniq(_concat(itemIds1, itemIds2));
          uniqueItemIds.sort();
          mapData = uniqueItemIds.map(itemId => ({ id: itemId }));
        }
        self.postMessage({
          type: 'end parse vosviewer-map-network file',
          data: { fileError, mapData, networkData },
        });
      }
    });
  }
}

function _removeUnconnectedItems(clustering, clusterToShow) {
  const itemsToShow = (clustering) ? clustering.getNodesPerCluster()[clusterToShow] : undefined;
  return itemsToShow;
}

function _prepareNetworkData(map, network) {
  const itemIdToIndex = {};
  _each(map, (item, index) => {
    itemIdToIndex[item.id] = index;
  });

  const links = {};
  _each(network, link => {
    const item1 = itemIdToIndex[link[0]];
    const item2 = itemIdToIndex[link[1]];
    if (item1 !== item2) {
      const strength = (link[2]) ? link[2] : 1;
      if (links[`${item1}-${item2}`]) {
        links[`${item1}-${item2}`].strength += strength;
        links[`${item2}-${item1}`].strength += strength;
      } else {
        links[`${item1}-${item2}`] = {
          item1,
          item2,
          strength,
        };
        links[`${item2}-${item1}`] = {
          item1: item2,
          item2: item1,
          strength,
        };
      }
    }
  });
  const sortedLinks = Object.values(links).sort((i, j) => _compareLinks(i, j));
  const nLinks = sortedLinks.length;

  const nNodes = Object.keys(itemIdToIndex).length;
  const edges = new Array(2);
  edges[0] = new Array(nLinks);
  edges[1] = new Array(nLinks);
  const edgeWeights = new Array(nLinks);
  for (let i = 0; i < nLinks; i++) {
    edges[0][i] = sortedLinks[i].item1;
    edges[1][i] = sortedLinks[i].item2;
    edgeWeights[i] = sortedLinks[i].strength;
  }

  return { nNodes, edges, edgeWeights, itemIdToIndex };
}

function _compareLinks(i, j) {
  if (i.item1 > j.item1) return 1;
  if (i.item1 < j.item1) return -1;
  if (i.item2 > j.item2) return 1;
  if (i.item2 < j.item2) return -1;
  return 0;
}
