/* global CONFIG IS_REACT_COMPONENT */
import React, { useContext, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { withResizeDetector } from 'react-resize-detector';
import { observer } from 'mobx-react-lite';
import levenSort from 'leven-sort';
import _isUndefined from 'lodash/isUndefined';
import _isPlainObject from 'lodash/isPlainObject';

import { parameterKeys } from 'utils/variables';
import {
  ConfigStoreContext, ClusteringStoreContext, DataStoreContext, LayoutStoreContext, QueryStringStoreContext, UiStoreContext, VisualizationStoreContext, WebworkerStoreContext,
  ConfigProvider, ClusteringProvider, DataProvider, LayoutProvider, NormalizationProvider, QueryStringProvider, UiProvider, UiRoriProvider, VisualizationProvider, WebworkerProvider
} from 'store/stores';

// The '@component' is resolved from an alias in the webpack configuration.
// eslint-disable-next-line import/no-unresolved
import App from '@component';

const VOSviewer = withResizeDetector(observer(({ width, targetRef, parameters = {}, data }) => {
  const configStore = useContext(ConfigStoreContext);
  const clusteringStore = useContext(ClusteringStoreContext);
  const dataStore = useContext(DataStoreContext);
  const layoutStore = useContext(LayoutStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const queryStringStore = useContext(QueryStringStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const [firstRender, setFirstRender] = useState(true);
  const fullscreenHandle = useFullScreenHandle();

  useEffect(() => {
    uiStore.setRootEl(targetRef.current);
  }, []);

  useEffect(() => {
    if (width !== undefined) uiStore.setComponentWidth(configStore.fullscreen ? window.innerWidth : width);
  }, [width, configStore.fullscreen]);

  if (firstRender) {
    setFirstRender(false);
    configStore.init(CONFIG);
    uiStore.updateStore(configStore);
    visualizationStore.updateStore(configStore);
    layoutStore.updateStore(configStore);
    clusteringStore.updateStore(configStore);
  }

  if (data) parameters[parameterKeys.JSON] = data;

  useEffect(() => {
    webworkerStore.addWorkerEventListener(d => {
      const { type, data } = d;
      switch (type) {
        case 'update loading screen':
          uiStore.setLoadingScreenProcessType(data.processType);
          uiStore.setLoadingScreenProgressValue(data.progressValue ? data.progressValue : 0);
          uiStore.setLoadingScreenIsOpen(true);
          break;
        case 'end parse vosviewer-json data':
        case 'end parse vosviewer-map-network data': {
          dataStore.init(data, configStore.uiStyle);
          if (!dataStore.dataError) {
            if (webworkerStore.resetParameters) {
              uiStore.updateStore({
                parameters: {
                  json: '',
                  map: '',
                  network: '',
                  item_color: configStore.parameters.item_color,
                  item_size: configStore.parameters.item_size,
                  show_info: configStore.parameters.show_info,
                  show_item: configStore.parameters.show_item
                }
              });
              visualizationStore.updateStore({
                parameters: {
                  zoom_level: configStore.parameters.zoom_level
                }
              });
            }
            if (_isPlainObject(dataStore.parameters)) {
              configStore.updateStore({ parameters: dataStore.parameters });
              uiStore.updateStore({ parameters: dataStore.parameters });
              visualizationStore.updateStore({ parameters: dataStore.parameters, colorSchemes: dataStore.getColorSchemes() });
              layoutStore.updateStore({ parameters: dataStore.parameters });
              clusteringStore.updateStore({ parameters: dataStore.parameters });
            } else if (_isPlainObject(dataStore.getColorSchemes())) {
              visualizationStore.updateStore({ parameters: dataStore.parameters, colorSchemes: dataStore.getColorSchemes() });
            }
            webworkerStore.startProcessData({ mapData: dataStore.mapData, networkData: dataStore.networkData });
          } else {
            uiStore.setErrorDialogIsOpen(true);
            uiStore.setLoadingScreenIsOpen(false);
          }
          break;
        }
        case 'end process data':
          webworkerStore.setRunLayout(dataStore.networkDataIsAvailable && !dataStore.coordinatesAreAvailable);
          webworkerStore.setRunClustering(dataStore.networkDataIsAvailable && !dataStore.clustersAreAvailable);

          visualizationStore.setItemIdToIndex(data.itemIdToIndex);
          if (!_isUndefined(visualizationStore.largestComponent) && data.hasUnconnectedItems) {
            webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: visualizationStore.largestComponent ? 'yes' : 'no', mapData: dataStore.mapData, networkData: dataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
          } else if (!dataStore.coordinatesAreAvailable && data.hasUnconnectedItems) {
            uiStore.setUnconnectedItemsDialog(data.hasUnconnectedItems, data.nItemsNetwork, data.nItemsLargestComponent);
            uiStore.setUnconnectedItemsDialogIsOpen(true);
            uiStore.setLoadingScreenIsOpen(false);
          } else {
            webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: 'no', mapData: dataStore.mapData, networkData: dataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
          }
          break;
        case 'end handle unconnected items':
          if (data.mapData && data.networkData && data.itemIdToIndex) {
            dataStore.setMapData(data.mapData);
            dataStore.setNetworkData(data.networkData);
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
          visualizationStore.updateItemCoordinates(data.newCoordinates);
          uiStore.setLoadingScreenIsOpen(false);
          if (webworkerStore.runClustering) {
            webworkerStore.startRunClustering(clusteringStore.getParameters());
          } else {
            _finalizeVisualization();
          }
          break;
        case 'end run clustering':
          uiStore.setLoadingScreenProgressValue(100);
          visualizationStore.updateItemClusters(data.newClusters, uiStore.darkTheme);
          uiStore.setLoadingScreenIsOpen(false);
          _finalizeVisualization();
          break;
        default:
          break;
      }
    });
    return () => {
      webworkerStore.terminateWorker();
    };
  }, []);

  function _initVisualization() {
    visualizationStore.init(dataStore.mapData, dataStore.networkData, dataStore.terminology);

    const itemSizeDefinedInConfig = !_isUndefined(configStore.parameters.item_size);
    const itemSizeProvidedInQueryString = !_isUndefined(queryStringStore.parameters.item_size);
    const itemSizeProvidedInFile = _isPlainObject(dataStore.parameters) && !_isUndefined(dataStore.parameters.item_size);
    const sizeIndex = ((!itemSizeDefinedInConfig && webworkerStore.resetParameters && !itemSizeProvidedInFile) || (!itemSizeDefinedInConfig && !webworkerStore.resetParameters && !itemSizeProvidedInQueryString && !itemSizeProvidedInFile)) ? visualizationStore.weightIndex : uiStore.sizeIndex;
    const weightIndex = sizeIndex;
    visualizationStore.updateWeights(weightIndex);

    const itemColorDefinedInConfig = !_isUndefined(configStore.parameters.item_color);
    const itemColorProvidedInQueryString = !_isUndefined(queryStringStore.parameters.item_color);
    const itemColorProvidedInFile = _isPlainObject(dataStore.parameters) && !_isUndefined(dataStore.parameters.item_color);
    const colorIndex = ((!itemColorDefinedInConfig && webworkerStore.resetParameters && !itemColorProvidedInFile) || (!itemColorDefinedInConfig && !webworkerStore.resetParameters && !itemColorProvidedInQueryString && !itemColorProvidedInFile)) ? 0 : uiStore.colorIndex;
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
    configStore.setUrlPreviewPanelIsOpen(!IS_REACT_COMPONENT && visualizationStore.itemsOrLinksWithUrl);
    uiStore.setLoadingScreenIsOpen(false);
    if (webworkerStore.loadNewData && uiStore.showInfo && (dataStore.title && dataStore.description)) uiStore.setInfoDialogIsOpen(true);
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
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} ref={targetRef}>
      <FullScreen handle={fullscreenHandle}>
        <App parameters={parameters} fullscreenHandle={fullscreenHandle} />
      </FullScreen>
    </div>
  );
}));

export default (props) => (
  <ConfigProvider>
    <ClusteringProvider>
      <DataProvider>
        <LayoutProvider>
          <NormalizationProvider>
            <QueryStringProvider>
              <UiProvider>
                <UiRoriProvider>
                  <VisualizationProvider>
                    <WebworkerProvider>
                      <VOSviewer {...props} />
                    </WebworkerProvider>
                  </VisualizationProvider>
                </UiRoriProvider>
              </UiProvider>
            </QueryStringProvider>
          </NormalizationProvider>
        </LayoutProvider>
      </DataProvider>
    </ClusteringProvider>
  </ConfigProvider>
);
