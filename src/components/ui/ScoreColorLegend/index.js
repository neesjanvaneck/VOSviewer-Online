import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import _each from 'lodash/each';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { padding, tickConfig, tickScale } from './helper';
import * as s from './styles';

const ScoreColorLegend = observer(({
  canvasWidth, canvasHeight, customFont, onClick
}) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [font, setFont] = useState('Roboto');

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
    visualizationStore.setGetScoreColorLegendCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx, font, visualizationStore.lastDataUpdate, visualizationStore.scoreIndex, visualizationStore.scoreColorSchemeName, visualizationStore.scoreColorLegendMinScore, visualizationStore.scoreColorLegendMaxScore, uiStore.darkTheme]);

  const draw = () => {
    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);
    const width = canvasWidth * visualizationStore.pixelRatio;
    const height = canvasHeight * visualizationStore.pixelRatio;
    const left = padding.left * visualizationStore.pixelRatio;
    const top = padding.top * visualizationStore.pixelRatio;
    const right = padding.right * visualizationStore.pixelRatio;
    const bottom = padding.bottom * visualizationStore.pixelRatio;
    const tickWidth = tickConfig.width * visualizationStore.pixelRatio;
    const tickHeight = tickConfig.height * visualizationStore.pixelRatio;

    // Draw color bar.
    const colorBarWidth = width - left - right;
    const colorBarHeight = height - top - bottom;
    const colorBarGradient = ctx.createLinearGradient(0, 0, colorBarWidth, 0);
    _each(visualizationStore.scoreColorScheme.domain(), rescaledScore => {
      colorBarGradient.addColorStop(rescaledScore, visualizationStore.scoreColorScheme(rescaledScore));
    });
    ctx.fillStyle = colorBarGradient;
    ctx.fillRect(left, top, colorBarWidth, colorBarHeight);
    ctx.strokeStyle = uiStore.darkTheme ? tickConfig.colorDarkTheme : tickConfig.colorLightTheme;
    ctx.lineWidth = tickWidth;
    ctx.strokeRect(left, top, colorBarWidth, colorBarHeight);

    // Draw ticks.
    const scoreRangeDomain = visualizationStore.scoreColorLegendScoreRange.domain();
    tickScale.range([0, colorBarWidth]).domain(scoreRangeDomain);
    ctx.fillStyle = uiStore.darkTheme ? tickConfig.colorDarkTheme : tickConfig.colorLightTheme;
    ctx.font = `${0.75 * visualizationStore.pixelRatio}rem ${font}`;
    ctx.textAlign = 'center';
    const ticks = tickScale.ticks(5);
    _each(ticks, tick => {
      const x = tickScale(tick) + left - tickWidth * 0.5;
      const y = colorBarHeight + top - tickHeight * 0.5;
      ctx.fillRect(x, y, tickWidth, tickHeight);
      ctx.fillText(tick, x, y + tickHeight + 12 * visualizationStore.pixelRatio);
    });
  };

  return (
    <canvas
      className={s.canvas({ width: canvasWidth, height: canvasHeight })}
      ref={canvasEl}
      width={canvasWidth * visualizationStore.pixelRatio}
      height={canvasHeight * visualizationStore.pixelRatio}
      onClick={onClick}
    />
  );
});

export default ScoreColorLegend;
