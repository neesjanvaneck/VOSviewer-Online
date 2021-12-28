import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Slider, Typography } from '@mui/material';

import { ConfigStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Visualization = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const changeScale = (scale, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateItemFontSizeAndCircleSize(scale, uiStore.itemSizeVariation, uiStore.maxLabelLength, configStore.uiStyle.font_family);
      visualizationStore.updateItems();
      visualizationStore.updateLinkLineWidth(scale, uiStore.linkSizeVariation);
      visualizationStore.updateLinks();
    } else {
      uiStore.setScale(scale);
    }
  };

  return (
    <>
      {configStore.uiConfig.control_panel.view.scale
        && (
          <div className={s.sliderBox}>
            <Typography className={s.sliderBoxLabel}>Scale</Typography>
            <Slider
              value={uiStore.scale}
              min={0.5}
              max={2.0}
              step={0.1}
              marks
              track={false}
              valueLabelDisplay="auto"
              onChange={(event, value) => changeScale(value)}
              onChangeCommitted={(event, value) => changeScale(value, true)}
            />
          </div>
        )
      }
    </>
  );
});

export default Visualization;
