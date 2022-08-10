import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  ConfigStoreContext, FileDataStoreContext, UiStoreContext, VisualizationStoreContext, WebworkerStoreContext
} from 'store/stores';
import InteractionCanvas from 'components/visualization/InteractionCanvas';
import DefaultLinkCanvas from 'components/visualization/DefaultLinkCanvas';
import DefaultItemCircleCanvas from 'components/visualization/DefaultItemCircleCanvas';
import HighlightedItemCircleLinkCanvas from 'components/visualization/HighlightedItemCircleLinkCanvas';
import ItemLabelCanvas from 'components/visualization/ItemLabelCanvas';
import * as s from './styles';

const VisualizationComponent = observer(({
  withoutUrlPreviewPanel, withoutLinks, withoutItemLabels, customFont
}) => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const visEl = useRef(null);
  const [canvasSize, setCanvasSize] = useState(undefined);

  const updateCanvasSize = () => {
    if (uiStore.componentWidth && uiStore.componentHeight) {
      const urlPreviewPanelWidth = ((configStore.urlPreviewPanel && !withoutUrlPreviewPanel) ? configStore.urlPreviewPanelWidth : 0);
      setCanvasSize(configStore.fullscreen ? [
        window.innerWidth - urlPreviewPanelWidth,
        window.innerHeight
      ] : [
        uiStore.componentWidth - urlPreviewPanelWidth,
        uiStore.componentHeight
      ]);
    }
  };

  useEffect(() => {
    if (canvasSize) {
      visualizationStore.setCanvasSize(canvasSize[0], canvasSize[1]);
      visualizationStore.updateItemPixelPositionAndScaling();
      visualizationStore.updateLabelScalingFactors();
      visualizationStore.updateItems();
      visualizationStore.updateLinks();
    }
  }, [canvasSize]);

  useEffect(() => {
    if (!withoutUrlPreviewPanel) updateCanvasSize();
  }, [configStore.urlPreviewPanel]);

  useEffect(() => {
    updateCanvasSize();
  }, [uiStore.componentWidth, uiStore.componentHeight, configStore.fullscreen]);

  useEffect(() => {
    if (visEl) {
      visEl.current.addEventListener('dragenter', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      visEl.current.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      visEl.current.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file) {
          if (file.type === 'application/json') {
            uiStore.setJsonFileSelectedName(file.name);
            fileDataStore.setJsonFile(file);
            webworkerStore.openJsonFile(fileDataStore.jsonFile, true);
          } else if (file.type === 'text/plain') {
            uiStore.setMapFileSelectedName(file.name);
            fileDataStore.setNetworkFile(undefined);
            fileDataStore.setMapFile(file);
            webworkerStore.openMapNetworkFile(fileDataStore.mapFile, fileDataStore.networkFile, true);
          }
        }
      }, false);
    }
  }, [visEl]);

  const handleClick = () => {
    uiStore.setScoreOptionsPanelIsOpen(false);
  };

  return (
    <div
      className={s.visContainer(configStore.urlPreviewPanel && !withoutUrlPreviewPanel, configStore.urlPreviewPanelWidth)}
      onClick={handleClick}
      ref={visEl}
    >
      {canvasSize && (
      <>
        <InteractionCanvas
          canvasWidth={canvasSize[0]}
          canvasHeight={canvasSize[1]}
          withoutLinks={withoutLinks}
        />
        {!withoutLinks ? (
          <DefaultLinkCanvas
            canvasWidth={canvasSize[0]}
            canvasHeight={canvasSize[1]}
          />
      ) : null}
        <DefaultItemCircleCanvas
          canvasWidth={canvasSize[0]}
          canvasHeight={canvasSize[1]}
        />
        <HighlightedItemCircleLinkCanvas
          canvasWidth={canvasSize[0]}
          canvasHeight={canvasSize[1]}
          withoutLinks={withoutLinks}
        />
        {!withoutItemLabels ? (
          <ItemLabelCanvas
            canvasWidth={canvasSize[0]}
            canvasHeight={canvasSize[1]}
            customFont={customFont}
          />
        ) : null}
      </>
      )}
    </div>
  );
});

export default VisualizationComponent;
