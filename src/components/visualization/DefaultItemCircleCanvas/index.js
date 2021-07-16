import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { ItemStatus, drawItemCircle, zoomContext } from 'utils/drawing';
import * as s from './styles';

const DefaultItemCircleCanvas = observer(({ canvasWidth, canvasHeight }) => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const canvasEl = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(canvasEl.current.getContext('2d'));
    visualizationStore.setGetDefaultItemCircleCanvasImage(() => canvasEl.current);
  }, []);

  useEffect(() => {
    if (ctx) draw();
  }, [ctx]);

  useEffect(() => {
    if (ctx) zoomContext(ctx, visualizationStore, draw);
  }, [visualizationStore.lastItemUpdate, visualizationStore.zTransform]);

  const draw = () => {
    ctx.clearRect(0, 0, canvasWidth * visualizationStore.pixelRatio, canvasHeight * visualizationStore.pixelRatio);
    for (let i = visualizationStore.items.length - 1; i >= 0; i--) {
      const item = visualizationStore.items[i];
      if (item._status === ItemStatus.DEFAULT) drawItemCircle(ctx, item, visualizationStore, uiStore);
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

export default DefaultItemCircleCanvas;
