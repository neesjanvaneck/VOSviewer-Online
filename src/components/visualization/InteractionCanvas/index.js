import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { pointer, select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { max, min, sum } from 'd3-array';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { zoomExtent, zoomScaleFactor, itemZoomLevel, visualizationBackgroundColors } from 'utils/variables';
import { LinkStatus, drawLinkForMouseInteraction, drawRoundedRectangle, zoomContext } from 'utils/drawing';
import * as s from './styles';

const InteractionCanvas = observer(({ canvasWidth, canvasHeight, withoutLinks }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setUpdateZoomLevel(updateZoomLevel);
    visualizationStore.setResetZoom(resetZoom);
    visualizationStore.setZoomIn(zoomIn);
    visualizationStore.setZoomOut(zoomOut);
    visualizationStore.setZoomFit(zoomFit);
    visualizationStore.setZoomTo(zoomTo);
    visualizationStore.setTranslateTo(translateTo);
    select(canvasEl.current).call(zoomEl);
    select(canvasEl.current)
      .on('mousemove', (event) => {
        const mousePosition = pointer(event).map(d => d * visualizationStore.pixelRatio);
        const hoveredItemIsFound = visualizationStore.findHoveredItem(mousePosition, uiStore.dimmingEffect);
        const hoveredLinkIsFound = withoutLinks ? undefined : visualizationStore.findHoveredLink(mousePosition, uiStore.dimmingEffect);
        select(canvasEl.current).style('cursor', hoveredItemIsFound || hoveredLinkIsFound ? 'pointer' : 'auto');
      })
      .on('mouseout', () => {
        visualizationStore.cancelHovering(uiStore.dimmingEffect);
      })
      .on('click', () => {
        visualizationStore.updateClickedItem(undefined, uiStore.dimmingEffect);
        visualizationStore.updateClickedLink(undefined, uiStore.dimmingEffect);
      });
  }, []);

  const zoomEl = zoom()
    .scaleExtent(zoomExtent)
    .on('zoom', (event) => {
      if (event.sourceEvent) event.sourceEvent.stopPropagation();
      visualizationStore.updateZTransform(event.transform);
    });

  const updateZoomLevel = (zoomLevel) => {
    select(canvasEl.current).call(zoomEl.scaleTo, zoomLevel);
  };

  const resetZoom = () => {
    select(canvasEl.current).call(zoomEl.transform, zoomIdentity);
  };

  const zoomIn = (scaleFactor = zoomScaleFactor) => {
    const scaleBy = scaleFactor;
    select(canvasEl.current)
      .transition()
      .duration(500)
      .call(zoomEl.scaleBy, scaleBy);
  };

  const zoomOut = (scaleFactor = zoomScaleFactor) => {
    const scaleBy = 1 / scaleFactor;
    select(canvasEl.current)
      .transition()
      .duration(500)
      .call(zoomEl.scaleBy, scaleBy);
  };

  const zoomFit = () => {
    select(canvasEl.current)
      .transition()
      .duration(500)
      .call(zoomEl.transform, zoomIdentity);
  };

  const zoomTo = (item) => {
    const s = itemZoomLevel;
    const x = canvasWidth / 2 - (item._cx * s) / visualizationStore.pixelRatio;
    const y = canvasHeight / 2 - (item._cy * s) / visualizationStore.pixelRatio;
    select(canvasEl.current)
      .transition()
      .duration(500)
      .call(zoomEl.transform, zoomIdentity.translate(x, y).scale(s));
  };

  const translateTo = (cx, cy) => {
    const x = cx / visualizationStore.pixelRatio;
    const y = cy / visualizationStore.pixelRatio;
    select(canvasEl.current)
      .call(zoomEl.translateTo, x, y);
  };

  useEffect(() => {
    visualizationStore.setGetScreenshotImage(getScreenshotImage);
    if (ctx) {
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    }
    visualizationStore.setInteractionCanvasContext(ctx);
  }, [ctx]);

  const getScreenshotImage = (fileFormat) => {
    const defaultLinkCanvasImage = visualizationStore.getDefaultLinkCanvasImage();
    const defaultItemCircleCanvasImage = visualizationStore.getDefaultItemCircleCanvasImage();
    const highlightedItemCircleLinkCanvasImage = visualizationStore.getHighlightedItemCircleLinkCanvasImage();
    const itemLabelCanvasImage = visualizationStore.getItemLabelCanvasImage();
    const scoreColorLegendCanvasImage = visualizationStore.getScoreColorLegendCanvasImage();
    const clusterColorLegendCanvasImage = visualizationStore.getClusterLegendCanvasImage();
    const colorLegendCanvasImage = scoreColorLegendCanvasImage || clusterColorLegendCanvasImage;
    const sizeLegendCanvasImage = visualizationStore.getSizeLegendCanvasImage();
    const logoImages = visualizationStore.getLogoImages();
    const canvasWidth = visualizationStore.canvasPixelWidth;
    const canvasHeight = visualizationStore.canvasPixelHeight;

    ctx.fillStyle = uiStore.darkTheme ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(defaultLinkCanvasImage, 0, 0);
    ctx.drawImage(defaultItemCircleCanvasImage, 0, 0);
    ctx.drawImage(highlightedItemCircleLinkCanvasImage, 0, 0);
    ctx.drawImage(itemLabelCanvasImage, 0, 0);

    const margin = 25;
    const borderRadius = 5;
    const borderColor = uiStore.darkTheme ? visualizationBackgroundColors.LIGHT : visualizationBackgroundColors.DARK;
    const legendPadding = 5;
    const logoPadding = 10;

    // Legend.
    if (colorLegendCanvasImage || sizeLegendCanvasImage) {
      let legendWidth = sizeLegendCanvasImage.width;
      if (clusterColorLegendCanvasImage) legendWidth = clusterColorLegendCanvasImage.width;
      else if (scoreColorLegendCanvasImage) legendWidth = scoreColorLegendCanvasImage.width + sizeLegendCanvasImage.width;
      const legendHeight = Math.max(sizeLegendCanvasImage.height, (colorLegendCanvasImage ? colorLegendCanvasImage.height : 0));
      const legendX = canvasWidth - legendWidth - margin - legendPadding;
      const legendY = canvasHeight - legendHeight - margin - legendPadding;
      drawRoundedRectangle(ctx, legendX - legendPadding, legendY - legendPadding, legendWidth + legendPadding * 2, legendHeight + legendPadding * 2, borderRadius, borderColor, uiStore.darkTheme);
      if (colorLegendCanvasImage) ctx.drawImage(colorLegendCanvasImage, legendX, legendY);
      let sizeLegendX = legendX;
      if (clusterColorLegendCanvasImage) sizeLegendX = legendX + clusterColorLegendCanvasImage.width - sizeLegendCanvasImage.width;
      else if (scoreColorLegendCanvasImage) sizeLegendX = legendX + scoreColorLegendCanvasImage.width;
      const sizeLegendY = canvasHeight - 0.5 * legendHeight - 0.5 * sizeLegendCanvasImage.height - margin - legendPadding;
      ctx.drawImage(sizeLegendCanvasImage, sizeLegendX, sizeLegendY);
    }

    // Logos.
    if (logoImages.length) {
      const logos = logoImages.map(logoImage => ({ image: logoImage }));
      let prevHeight = 0;
      logos.forEach(logo => {
        logo.x = margin + logoPadding;
        logo.y = canvasHeight - logo.image.height * visualizationStore.pixelRatio - margin - logoPadding - prevHeight;
        logo.width = logo.image.width * visualizationStore.pixelRatio;
        logo.height = logo.image.height * visualizationStore.pixelRatio;
        prevHeight += logo.height + logoPadding;
      });
      const logosX = min(logos, logo => logo.x);
      const logosY = min(logos, logo => logo.y);
      const logosWidth = max(logos, logo => logo.width);
      const logosHeight = sum(logos, logo => logo.height);
      drawRoundedRectangle(ctx, logosX - logoPadding, logosY - logoPadding, logosWidth + logoPadding * 2, logosHeight + logoPadding * 2 + logoPadding * (logos.length - 1), borderRadius, borderColor, uiStore.darkTheme);
      logos.forEach(logo => {
        const dx = logosWidth / 2 - logo.width / 2;
        ctx.drawImage(logo.image, logo.x + dx, logo.y, logo.width, logo.height);
      });
    }

    const dataURL = canvasEl.current.toDataURL(`image/${fileFormat}`);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    return dataURL;
  };

  useEffect(() => {
    if (ctx) zoomContext(ctx, visualizationStore, drawLinksForMouseInteraction);
  }, [visualizationStore.lastLinkUpdate, visualizationStore.zTransform, visualizationStore.clickedItem]);

  const drawLinksForMouseInteraction = () => {
    const linksToDraw = visualizationStore.filteredLinks;
    for (let i = linksToDraw.length - 1; i >= 0; i--) {
      const link = linksToDraw[i];
      if (link._status === LinkStatus.DEFAULT && visualizationStore.itemsForLinks[link.from] && visualizationStore.itemsForLinks[link.to]) {
        drawLinkForMouseInteraction(ctx, link, visualizationStore, uiStore);
      }
    }
    visualizationStore.highlightedLinks.forEach(link => {
      drawLinkForMouseInteraction(ctx, link, visualizationStore, uiStore);
    });
    if (visualizationStore.clickedLink) {
      drawLinkForMouseInteraction(ctx, visualizationStore.clickedLink, visualizationStore, uiStore);
    }
    if (visualizationStore.hoveredLink) {
      drawLinkForMouseInteraction(ctx, visualizationStore.hoveredLink, visualizationStore, uiStore);
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

export default InteractionCanvas;
