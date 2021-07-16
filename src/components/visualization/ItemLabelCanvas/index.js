import React, { useState, useEffect, useRef, useContext } from 'react';
import { observer } from 'mobx-react-lite';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { ItemStatus, drawItemLabel, zoomContext } from 'utils/drawing';
import * as s from './styles';

const ItemLabelCanvas = observer(({ canvasWidth, canvasHeight, customFont }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [font, setFont] = useState(customFont);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFont(customFont || 'Roboto');
      });
    } else {
      setTimeout(() => {
        setFont(customFont || 'Roboto');
      }, 250);
    }

    const context = canvasEl.current.getContext('2d');
    setCtx(context);
    visualizationStore.setLabelCanvasContext(context);
    visualizationStore.setGetItemLabelCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx]);

  useEffect(() => {
    if (ctx) zoomContext(ctx, visualizationStore, draw);
  }, [visualizationStore.lastItemUpdate, visualizationStore.zTransform]);

  const draw = () => {
    const {
      zTransform, pixelRatio, highlightedItems, clickedItem, hoveredItem
    } = visualizationStore;
    ctx.clearRect(0, 0, canvasWidth * pixelRatio, canvasHeight * pixelRatio);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw labels of default items.
    for (let i = visualizationStore.items.length - 1; i >= 0; i--) {
      const item = visualizationStore.items[i];
      if ((item._labelScalingFactor < zTransform.k) && (item._status === ItemStatus.DEFAULT)) {
        drawItemLabel(ctx, item, font, visualizationStore, uiStore);
      }
    }
    // Draw labels of highlighted items.
    for (let i = highlightedItems.length - 1; i >= 0; i--) {
      const item = highlightedItems[i];
      if (item._labelScalingFactor < zTransform.k) {
        drawItemLabel(ctx, item, font, visualizationStore, uiStore, ItemStatus.HIGHLIGHTED, false);
      }
    }
    // Draw label of selected item.
    if (clickedItem) {
      drawItemLabel(ctx, clickedItem, font, visualizationStore, uiStore, ItemStatus.SELECTED, true);
    }
    // Draw label of hovered item.
    if (hoveredItem) {
      drawItemLabel(ctx, hoveredItem, font, visualizationStore, uiStore, ItemStatus.HOVERED, true);
    }
  };

  return (
    <canvas
      className={s.canvas}
      ref={canvasEl}
      width={canvasWidth * visualizationStore.pixelRatio}
      height={canvasHeight * visualizationStore.pixelRatio}
    />
  );
});

export default ItemLabelCanvas;
