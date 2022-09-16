import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { format } from 'd3-format';
import _isFinite from 'lodash/isFinite';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { roundNumberByDigits } from 'utils/helpers';
import {
  color, lineWidth, gap, minRadius, midRadius, maxRadius, padding, radii
} from './helper';
import * as s from './styles';

const SizeLegend = observer(({ canvasWidth, canvasHeight, customFont }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [font, setFont] = useState('Roboto');
  const [ticks, setTicks] = useState([]);

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
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setGetSizeLegendCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx, font, ticks, uiStore.darkTheme]);

  useEffect(() => {
    if (visualizationStore.items.length) {
      const minValue = visualizationStore.getValueByRadius(minRadius, uiStore.scale, uiStore.itemSizeVariation);
      const midValue = visualizationStore.getValueByRadius(midRadius, uiStore.scale, uiStore.itemSizeVariation);
      const maxValue = visualizationStore.getValueByRadius(maxRadius, uiStore.scale, uiStore.itemSizeVariation);
      setTicks(
        _isFinite(minValue) && _isFinite(midValue) && _isFinite(maxValue) ? [minValue, midValue, maxValue] : [null, null, null]
      );
    }
  }, [visualizationStore.lastDataUpdate, visualizationStore.weightIndex, uiStore.scale, uiStore.itemSizeVariation]);

  const draw = () => {
    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);
    ctx.font = `${0.75 * visualizationStore.pixelRatio}rem ${font}`;
    ctx.textBaseline = 'middle';
    ctx.lineWidth = lineWidth * visualizationStore.pixelRatio;
    ctx.strokeStyle = uiStore.darkTheme ? color.colorDarkTheme : color.colorLightTheme;
    ctx.fillStyle = uiStore.darkTheme ? color.colorDarkTheme : color.colorLightTheme;

    ticks.forEach((tick, i) => {
      // Draw circles.
      ctx.beginPath();
      ctx.setLineDash([]);
      const cx = maxRadius + padding.left;
      const cy = maxRadius * 2 - radii[i] + padding.top + 5;
      const r = radii[i];
      ctx.arc(cx * visualizationStore.pixelRatio, cy * visualizationStore.pixelRatio, r * visualizationStore.pixelRatio, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw lines.
      const x1 = maxRadius + padding.left;
      const y1 = maxRadius * 2 - radii[i] * 2 + padding.top + 5;
      const x2 = maxRadius * 2 + gap * 0.5 + padding.left;
      const y2 = maxRadius * 2 - radii[i] * 2 + padding.top + 5;
      ctx.beginPath();
      ctx.setLineDash([1 * visualizationStore.pixelRatio, 1 * visualizationStore.pixelRatio]);
      ctx.moveTo(x1 * visualizationStore.pixelRatio, y1 * visualizationStore.pixelRatio);
      ctx.lineTo(x2 * visualizationStore.pixelRatio, y2 * visualizationStore.pixelRatio);
      ctx.stroke();
      if ((ticks[0] !== ticks[1]) && (ticks[1] !== ticks[2])) {
        // Draw text.
        const x = maxRadius * 2 + gap + padding.left;
        const y = maxRadius * 2 - radii[i] * 2 + padding.top + 5;
        let tickText;
        if (ticks[2] > 100) {
          tickText = format('~s')(roundNumberByDigits(tick));
        } else if (ticks[0] < 0.005) {
          tickText = format('.0e')(tick);
        } else if (ticks[0] < 0.05) {
          tickText = format('.2f')(tick);
        } else if (ticks[2] > 10) {
          tickText = format('.0f')(tick);
        } else {
          tickText = format('.1f')(tick);
        }
        ctx.fillText(tickText, x * visualizationStore.pixelRatio, y * visualizationStore.pixelRatio);
      }
    });
  };

  return (
    <canvas
      className={s.canvas({ width: canvasWidth, height: canvasHeight })}
      ref={canvasEl}
      width={canvasWidth * visualizationStore.pixelRatio}
      height={canvasHeight * visualizationStore.pixelRatio}
    />
  );
});

export default SizeLegend;
