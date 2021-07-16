import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { ItemStatus, LinkStatus, drawItemCircle, drawLink, zoomContext } from 'utils/drawing';
import * as s from './styles';

const HighlightedItemCircleLinkCanvas = observer(({ canvasWidth, canvasHeight, withoutLinks }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setGetHighlightedItemCircleLinkCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx]);

  useEffect(() => {
    if (ctx) zoomContext(ctx, visualizationStore, draw);
  }, [visualizationStore.lastItemUpdate, visualizationStore.zTransform]);

  const draw = () => {
    const {
      hoveredItem, clickedItem, highlightedItems, hoveredLink, clickedLink, highlightedLinks
    } = visualizationStore;
    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);

    if (!withoutLinks) {
      // Draw highlighted links.
      for (let i = highlightedLinks.length - 1; i >= 0; i--) {
        const link = highlightedLinks[i];
        drawLink(ctx, link, visualizationStore, uiStore);
      }
      // Draw selected link.
      if (clickedLink) {
        drawLink(ctx, clickedLink, visualizationStore, uiStore, LinkStatus.SELECTED);
      }
      // Draw hovered link.
      if (hoveredLink) {
        drawLink(ctx, hoveredLink, visualizationStore, uiStore, LinkStatus.HOVERED);
      }
    }
    // Draw circle of highlighted items.
    for (let i = highlightedItems.length - 1; i >= 0; i--) {
      const item = highlightedItems[i];
      drawItemCircle(ctx, item, visualizationStore, uiStore);
    }
    // Draw circle of selected item.
    if (clickedItem) {
      drawItemCircle(ctx, clickedItem, visualizationStore, uiStore, ItemStatus.SELECTED);
    }
    // Draw circle of hovered item.
    if (hoveredItem) {
      drawItemCircle(ctx, hoveredItem, visualizationStore, uiStore, ItemStatus.HOVERED);
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

export default HighlightedItemCircleLinkCanvas;
