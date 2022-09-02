import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { withResizeDetector } from 'react-resize-detector';

import {
  ConfigStoreContext, DataStoreContext, UiStoreContext, VisualizationStoreContext, WebworkerStoreContext
} from 'store/stores';
import InteractionCanvas from 'components/visualization/InteractionCanvas';
import DefaultLinkCanvas from 'components/visualization/DefaultLinkCanvas';
import DefaultItemCircleCanvas from 'components/visualization/DefaultItemCircleCanvas';
import HighlightedItemCircleLinkCanvas from 'components/visualization/HighlightedItemCircleLinkCanvas';
import ItemLabelCanvas from 'components/visualization/ItemLabelCanvas';
import * as s from './styles';

const VisualizationComponent = observer(({
  width, height, targetRef, withoutUrlPreviewPanel, withoutLinks, withoutItemLabels, customFont
}) => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const [canvasSize, setCanvasSize] = useState(undefined);

  const updateCanvasSize = () => {
    setCanvasSize([
      targetRef.current.offsetWidth,
      targetRef.current.offsetHeight
    ]);
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
    if (width && height) {
      updateCanvasSize();
    }
  }, [width, height]);

  useEffect(() => {
    if (targetRef) {
      targetRef.current.addEventListener('dragenter', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      targetRef.current.addEventListener('dragover', (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      targetRef.current.addEventListener('drop', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.dataTransfer.files[0];

        if (file) {
          if (file.type === 'application/json') {
            uiStore.setJsonFileSelectedName(file.name);
            dataStore.setJsonFile(file);
            webworkerStore.openJsonData(dataStore.jsonFile, true);
          } else if (file.type === 'text/plain') {
            uiStore.setMapFileSelectedName(file.name);
            dataStore.setNetworkFile(undefined);
            dataStore.setMapFile(file);
            webworkerStore.openMapNetworkData(dataStore.mapFile, dataStore.networkFile, true);
          }
        }
      }, false);
    }
  }, [targetRef]);

  const handleClick = () => {
    uiStore.setScoreOptionsPanelIsOpen(false);
  };

  return (
    <div
      className={s.visContainer(configStore.urlPreviewPanel && !withoutUrlPreviewPanel, configStore.urlPreviewPanelWidth)}
      onClick={handleClick}
      ref={targetRef}
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

export default withResizeDetector(VisualizationComponent);
