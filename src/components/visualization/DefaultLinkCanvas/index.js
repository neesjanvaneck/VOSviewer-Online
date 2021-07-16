import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { timer } from 'd3-timer';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { LinkStatus, drawLink, zoomContext } from 'utils/drawing';
import { visualizationBackgroundColors } from 'utils/variables';
import * as s from './styles';

let frameTimer;
let frameIndex = 0;

const stopTimer = () => {
  frameIndex = 0;
  frameTimer.stop();
};

const DefaultLinkCanvas = observer(({ canvasWidth, canvasHeight }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setGetDefaultLinkCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) animate();
  }, [ctx]);

  useEffect(() => {
    if (ctx) zoomContext(ctx, visualizationStore, animate, true);
  }, [visualizationStore.lastItemUpdate, visualizationStore.lastLinkUpdate, visualizationStore.zTransform, uiStore.nLinksPerFrame, uiStore.linkTransparency]);

  const animate = () => {
    if (!visualizationStore.filteredLinks.length) visualizationStore.updateFilteredAndVisibleLinks(uiStore.minLinkStrength, uiStore.maxNLinks);
    if (frameTimer) stopTimer();
    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);
    ctx.fillStyle = uiStore.darkTheme ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT;
    ctx.fillRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);
    ctx.globalAlpha = 1 - uiStore.linkTransparency;
    let nextFrameIndex = frameIndex + uiStore.nLinksPerFrame;
    drawPartOfLinks(nextFrameIndex);
    frameTimer = timer(() => {
      nextFrameIndex = frameIndex + uiStore.nLinksPerFrame;
      drawPartOfLinks(nextFrameIndex);
      if (nextFrameIndex >= Math.min(visualizationStore.filteredLinks.length, uiStore.maxNLinks)) {
        stopTimer();
        ctx.restore();
      }
    }, 150);
  };

  const drawPartOfLinks = nextFrameIndex => {
    const linksToDraw = visualizationStore.filteredLinks.slice(frameIndex, Math.min(nextFrameIndex, uiStore.maxNLinks));
    frameIndex = nextFrameIndex;
    for (let i = linksToDraw.length - 1; i >= 0; i--) {
      const link = linksToDraw[i];
      if (link._status === LinkStatus.DEFAULT && visualizationStore.itemsForLinks[link.from] && visualizationStore.itemsForLinks[link.to]) {
        drawLink(ctx, link, visualizationStore, uiStore);
      }
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

export default DefaultLinkCanvas;
