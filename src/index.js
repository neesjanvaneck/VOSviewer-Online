/* global CONFIG MODE */
import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'react-dom';
import { observer } from 'mobx-react-lite';
import levenSort from 'leven-sort';
import _isUndefined from 'lodash/isUndefined';
import _isPlainObject from 'lodash/isPlainObject';

import {
  ConfigStoreContext, ClusteringStoreContext, FileDataStoreContext, LayoutStoreContext, UiStoreContext, VisualizationStoreContext, QueryStringStoreContext, WebworkerStoreContext
} from 'store/stores';
import VOSviewerApp from './VOSviewerApp';
import DimensionsApp from './DimensionsApp';
import ZetaAlphaApp from './ZetaAlphaApp';
import RoRIApp from './RoRIApp';

const root = document.createElement('div');
document.body.appendChild(root);

const APP = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const clusteringStore = useContext(ClusteringStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const [firstRender, setFirstRender] = useState(true);

  if (firstRender) {
    setFirstRender(false);
    configStore.init(CONFIG);
    uiStore.updateStore(configStore);
    visualizationStore.updateStore(configStore);
    layoutStore.updateStore(configStore);
    clusteringStore.updateStore(configStore);
  }

  const compute = (origin) => {
    const jsonData = visualizationStore.getJsonData(
      fileDataStore.getTerminology(),
      fileDataStore.getTemplates(),
      fileDataStore.getStyles(),
      fileDataStore.parameters,
      fileDataStore.getColorSchemes(),
      fileDataStore.getClusters()
    );

    fileDataStore.setPreviousJsonData(jsonData);
    const baseUrl = (origin.includes("localhost") || origin.includes("search-staging") ) ? 'https://api-staging.zeta-alpha.com' : 'https://api.zeta-alpha.com';
    const newData = { url: `${baseUrl}/v0/service/documents/document/vos-cluster-titles`, method: 'POST', body: JSON.stringify(jsonData) };

    webworkerStore.openJsonFile(newData, false);
  };

  const handleGoBack = () => {
    const oldData = fileDataStore.getPreviousJsonData();
    webworkerStore.openJsonFile(oldData, false);
  };

  const isAcceptableUrl = (url) => {
    const accaptedOrigins = ['http://localhost:3000', 'https://search-staging.zeta-alpha.com', 'https://search.zeta-alpha.com'];
    const regex = /https:\/\/search-staging-pr-\d+.zeta-alpha.com/g;
    return accaptedOrigins.includes(url) || !!url.match(regex);
  };

  useEffect(() => {
    window.addEventListener('message', (ev) => {
      if (isAcceptableUrl(ev.origin)) {
        if (ev.data === 'generate cluster titles') {
          compute(ev.origin);
        }
        if (ev.data === 'go back to previous titles') {
          handleGoBack();
        }
      }
    }, false);


    webworkerStore.addWorkerEventListener(d => {
      const { type, data } = d;

      // Replay worker messages into parent window for iframe --> page communication.
      window.parent.postMessage(JSON.stringify({ type, data }), "*");
      switch (type) {
        case 'update loading screen':
          uiStore.setLoadingScreenProcessType(data.processType);
          uiStore.setLoadingScreenProgressValue(data.progressValue ? data.progressValue : 0);
          uiStore.setLoadingScreenIsOpen(true);
          break;
        case 'end parse vosviewer-json file':
        case 'end parse vosviewer-map-network file': {
          fileDataStore.init(data, configStore.uiStyle);
          if (!fileDataStore.fileError) {
            if (webworkerStore.resetParameters) {
              uiStore.updateStore({
                parameters: {
                  json: '',
                  map: '',
                  network: '',
                  item_color: configStore.parameters.item_color,
                  item_size: configStore.parameters.item_size,
                  show_item: configStore.parameters.show_item,
                }
              });
              visualizationStore.updateStore({
                parameters: {
                  zoom_level: configStore.parameters.zoom_level
                }
              });
            }
            if (_isPlainObject(fileDataStore.parameters)) {
              configStore.updateStore({ parameters: fileDataStore.parameters });
              uiStore.updateStore({ parameters: fileDataStore.parameters });
              visualizationStore.updateStore({ parameters: fileDataStore.parameters, colorSchemes: fileDataStore.getColorSchemes() });
              layoutStore.updateStore({ parameters: fileDataStore.parameters });
              clusteringStore.updateStore({ parameters: fileDataStore.parameters });
            }
            webworkerStore.startProcessData({ mapData: fileDataStore.mapData, networkData: fileDataStore.networkData });
          } else {
            uiStore.setErrorDialogIsOpen(true);
            uiStore.setLoadingScreenIsOpen(false);
          }
          break;
        }
        case 'end process data':
          webworkerStore.setRunLayout(fileDataStore.networkDataIsAvailable && !fileDataStore.coordinatesAreAvailable);
          webworkerStore.setRunClustering(fileDataStore.networkDataIsAvailable && !fileDataStore.clustersAreAvailable);

          visualizationStore.setItemIdToIndex(data.itemIdToIndex);
          if (!_isUndefined(visualizationStore.largestComponent)) {
            webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: visualizationStore.largestComponent ? 'yes' : 'no', mapData: fileDataStore.mapData, networkData: fileDataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
          } else if (!fileDataStore.coordinatesAreAvailable && data.hasUnconnectedItems) {
            uiStore.setUnconnectedItemsDialog(data.hasUnconnectedItems, data.nItemsNetwork, data.nItemsLargestComponent);
            uiStore.setUnconnectedItemsDialogIsOpen(true);
            uiStore.setLoadingScreenIsOpen(false);
          } else {
            webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: 'no', mapData: fileDataStore.mapData, networkData: fileDataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
          }
          break;
        case 'end handle unconnected items':
          if (data.mapData && data.networkData && data.itemIdToIndex) {
            fileDataStore.setMapData(data.mapData);
            fileDataStore.setNetworkData(data.networkData);
            visualizationStore.setItemIdToIndex(data.itemIdToIndex);
            webworkerStore.setRunLayout(true);
          }
          _initVisualization();
          if (webworkerStore.runLayout) {
            webworkerStore.startRunLayout(layoutStore.getParameters());
          } else if (webworkerStore.runClustering) {
            webworkerStore.startRunClustering(clusteringStore.getParameters());
          } else if (webworkerStore.loadNewData) {
            _finalizeVisualization();
          }
          break;
        case 'update run layout progress':
          if (layoutStore.canceled) {
            layoutStore.setCanceled(false);
            _finalizeVisualization();
            break;
          }
          uiStore.setLoadingScreenProgressValue(data.progressValue);
          webworkerStore.continueRunLayout();
          break;
        case 'update run clustering progress':
          if (clusteringStore.canceled) {
            clusteringStore.setCanceled(false);
            _finalizeVisualization();
            break;
          }
          uiStore.setLoadingScreenProgressValue(data.progressValue);
          webworkerStore.continueRunClustering();
          break;
        case 'end run layout':
          uiStore.setLoadingScreenProgressValue(100);
          visualizationStore.setLayout(data.bestLayout.coordinate);
          uiStore.setLoadingScreenIsOpen(false);
          if (webworkerStore.runClustering) {
            webworkerStore.startRunClustering(clusteringStore.getParameters());
          } else {
            _finalizeVisualization();
          }
          break;
        case 'end run clustering':
          uiStore.setLoadingScreenProgressValue(100);
          visualizationStore.setClusters(data.bestClustering, uiStore.darkTheme);
          uiStore.setLoadingScreenIsOpen(false);
          _finalizeVisualization();
          break;
        default:
          break;
      }
    });
  }, []);

  function _initVisualization() {
    visualizationStore.init(fileDataStore.mapData, fileDataStore.networkData, fileDataStore.terminology);

    const itemSizeDefinedInConfig = !_isUndefined(configStore.parameters.item_size);
    const itemSizeProvidedInQueryString = !_isUndefined(queryStringStore.parameters.item_size);
    const itemSizeProvidedInFile = _isPlainObject(fileDataStore.parameters) && !_isUndefined(fileDataStore.parameters.item_size);
    const sizeIndex = ((!itemSizeDefinedInConfig && webworkerStore.resetParameters && !itemSizeProvidedInFile) || (!itemSizeDefinedInConfig && !webworkerStore.resetParameters && !itemSizeProvidedInQueryString && !itemSizeProvidedInFile)) ? visualizationStore.weightIndex : uiStore.sizeIndex;
    const weightIndex = sizeIndex;
    visualizationStore.updateWeights(weightIndex);

    const itemColorDefinedInConfig = !_isUndefined(configStore.parameters.item_color);
    const itemColorProvidedInQueryString = !_isUndefined(queryStringStore.parameters.item_color);
    const itemColorProvidedInFile = _isPlainObject(fileDataStore.parameters) && !_isUndefined(fileDataStore.parameters.item_color);
    const colorIndex = ((!itemColorDefinedInConfig && webworkerStore.resetParameters && !itemSizeProvidedInFile) || (!itemColorDefinedInConfig && !webworkerStore.resetParameters && !itemColorProvidedInQueryString && !itemColorProvidedInFile)) ? 0 : uiStore.colorIndex;
    const scoreIndex = colorIndex - 1;
    if (colorIndex > 0) visualizationStore.updateScores(scoreIndex);

    visualizationStore.updateItemPixelPositionAndScaling();
    visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, uiStore.itemSizeVariation, uiStore.maxLabelLength, configStore.uiStyle.font_family);
    visualizationStore.updateLinkLineWidth(uiStore.scale, uiStore.linkSizeVariation);

    uiStore.setSizeIndex(visualizationStore.weightIndex);
    uiStore.setColorIndex((visualizationStore.scoreIndex === scoreIndex) ? colorIndex : 0);
  }

  function _finalizeVisualization() {
    visualizationStore.updateData();
    visualizationStore.updateZoomLevel();
    if (uiStore.showItem) _showItem();
    configStore.setUrlPreviewPanelIsOpen(visualizationStore.itemsOrLinksWithUrl);
    uiStore.setLoadingScreenIsOpen(false);
  }

  function _showItem() {
    const filteredItems = visualizationStore.items.filter(item => item.label.toLowerCase().indexOf(uiStore.showItem.toLowerCase()) !== -1);
    const sortedItems = levenSort(filteredItems, uiStore.showItem.toLowerCase(), 'label');
    const foundItem = sortedItems[0];
    if (foundItem) {
      setTimeout(() => {
        visualizationStore.updateClickedItem(foundItem, uiStore.dimmingEffect);
        if (!visualizationStore.initialZoomLevel) {
          visualizationStore.zoomTo(foundItem);
        }
      }, 500);
    }
    uiStore.setShowItem('');
  }

  return (
    <>
      {MODE === 'vosviewer' && <VOSviewerApp />}
      {MODE === 'dimensions' && <DimensionsApp />}
      {MODE === 'zetaalpha' && <ZetaAlphaApp />}
      {MODE === 'rori' && <RoRIApp />}
    </>
  );
});
render(
  <APP />,
  root
);
