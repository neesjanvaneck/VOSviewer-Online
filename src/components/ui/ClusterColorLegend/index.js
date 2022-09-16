import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { select } from 'd3-selection';

import { DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { drawRoundedRectangle } from 'utils/drawing';
import { trimTextEnd } from 'utils/helpers';
import {
  canvasPadding, circlePadding, color, lineWidth, radius, rectPadding, textPadding
} from './helper';
import * as s from './styles';

const ClusterColorLegend = observer(({ showTopClustersOnly, canvasWidth, legendWidth, customFont }) => {
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [font, setFont] = useState('Roboto');
  const [mouseCoord, setMouseCoord] = useState([]);

  useEffect(() => {
    setFont(customFont || 'Roboto');
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setGetClusterLegendCanvasImage(() => canvasEl.current);
    select(canvasEl.current)
      .on('mousemove', (event) => {
        setMouseCoord([event.offsetX, event.offsetY]);
      })
      .on('mouseout', () => {
        setMouseCoord([]);
      });
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx, mouseCoord, font, showTopClustersOnly, uiStore.darkTheme, visualizationStore.lastItemUpdate]);

  const getLegendItems = () => {
    const arr = Array.from(dataStore.clusters, ([key, value]) => ({ key, value }));
    return showTopClustersOnly ? arr.slice(0, 6) : arr;
  };

  const draw = () => {
    const legendItems = getLegendItems();
    const itemHeight = 20;
    const itemWidth = legendWidth / 2;
    const canvasHeight = Math.ceil(legendItems.length / 2) * itemHeight + 2 * canvasPadding;
    select(canvasEl.current)
      .style('height', canvasHeight)
      .attr('height', canvasHeight * visualizationStore.pixelRatio);

    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);

    ctx.font = `${0.75 * visualizationStore.pixelRatio}rem ${font}`;
    ctx.textBaseline = 'middle';
    ctx.lineWidth = lineWidth * visualizationStore.pixelRatio;

    const letterWidth = ctx.measureText('a');
    const maxTextLength = Math.floor(((itemWidth - radius - textPadding) * visualizationStore.pixelRatio - 2 * letterWidth.width) / letterWidth.width);
    let hovered;
    legendItems.forEach((item, i) => {
      const itemX = i % 2 === 0 ? 0 : itemWidth;
      const itemY = Math.floor(i / 2) * itemHeight + canvasPadding;

      // Draw circles.
      ctx.beginPath();
      const cx = itemX + radius + circlePadding;
      const cy = itemY + radius + circlePadding;
      ctx.arc(cx * visualizationStore.pixelRatio, cy * visualizationStore.pixelRatio, radius * visualizationStore.pixelRatio, 0, 2 * Math.PI);
      ctx.fillStyle = visualizationStore.clusterColorScheme(item.key);
      ctx.fill();

      // Draw text.
      const x = cx + radius + textPadding;
      const y = cy;
      const textIsHovered = item.value.length > maxTextLength && mouseCoord.length
        && mouseCoord[0] > itemX
        && mouseCoord[0] < itemX + itemWidth
        && mouseCoord[1] > itemY
        && mouseCoord[1] < itemY + itemHeight;
      if (textIsHovered) {
        const text = ctx.measureText(item.value);
        hovered = {
          rectX: (x - rectPadding) * visualizationStore.pixelRatio,
          rectY: (y - itemHeight / 2) * visualizationStore.pixelRatio - visualizationStore.pixelRatio,
          x: x * visualizationStore.pixelRatio,
          y: y * visualizationStore.pixelRatio,
          w: text.width + 2 * rectPadding * visualizationStore.pixelRatio,
          h: itemHeight * visualizationStore.pixelRatio,
          text: item.value,
        };
      }
      const itemText = trimTextEnd(item.value, maxTextLength);
      ctx.fillStyle = uiStore.darkTheme ? color.colorDarkTheme : color.colorLightTheme;
      ctx.fillText(itemText, x * visualizationStore.pixelRatio, y * visualizationStore.pixelRatio);
    });
    if (hovered) {
      const rectShadowcolor = '#ccc';
      drawRoundedRectangle(ctx, hovered.rectX, hovered.rectY, hovered.w, hovered.h, 2, rectShadowcolor, uiStore.darkTheme);
      ctx.fillStyle = uiStore.darkTheme ? color.colorDarkTheme : color.colorLightTheme;
      ctx.fillText(hovered.text, hovered.x, hovered.y );
    }
  };

  return (
    <canvas
      className={s.canvas({ width: canvasWidth })}
      ref={canvasEl}
      width={canvasWidth * visualizationStore.pixelRatio}
    />
  );
});

export default ClusterColorLegend;
