import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Slider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { min } from 'd3-array';

import { UiRoriStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import InfoPanel from 'components/ui-rori/InfoPanel';
import SizeLegend from 'components/ui/SizeLegend';
import ClusterColorLegend from 'components/ui-rori/ClusterColorLegend';
import ScoreColorLegend from 'components/ui/ScoreColorLegend';
import ScoreOptionsPanel from 'components/ui-rori/ScoreOptionsPanel';
import Colors from './colors';
import * as s from './styles';

const LegendPanel = observer(() => {
  const uiRoriStore = useContext(UiRoriStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const changeScale = (scale, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateItemFontSizeAndCircleSize(scale, uiStore.itemSizeVariation, uiStore.maxLabelLength);
      visualizationStore.updateItems();
    } else {
      uiStore.setScale(scale);
    }
  };

  const changeItemSizeVariation = (itemSizeVariation, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, itemSizeVariation, uiStore.maxLabelLength);
      visualizationStore.updateItems();
    } else {
      uiStore.setItemSizeVariation(itemSizeVariation);
    }
  };

  const exitSettingsPanel = () => {
    uiRoriStore.setLegendSettingsPanelIsOpen(false);
  };

  const legendSettingsPanel = (
    <div className={s.controls}>
      <IconButton
        className="close-btn"
        onClick={exitSettingsPanel}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      {uiRoriStore.legendSettingsPanelType === 'color' ? (
        <>
          <Colors />
          {uiStore.colorIndex > 0 && <ScoreOptionsPanel />}
        </>
       ) : (
         <div className="item">
           <div className="title">Size variation:</div>
           <div className="sizeVariation">
             <Slider
               value={uiStore.itemSizeVariation}
               min={0}
               max={1}
               step={0.1}
               marks
               track={false}
               valueLabelDisplay="auto"
               onChange={(event, value) => changeItemSizeVariation(value)}
               onChangeCommitted={(event, value) => changeItemSizeVariation(value, true)}
             />
           </div>
           <div className="title">Scale:</div>
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
      )}
    </div>
  );

  return (
    <div className={s.panel}>
      {uiRoriStore.legendSettingsPanelIsOpen ? legendSettingsPanel : (<InfoPanel /> )}
      <div className="flexPanel">
        <div
          className="sizeLegend"
          onClick={() => uiRoriStore.setLegendSettingsPanelType('size')}
        >
          <SizeLegend
            canvasWidth={80}
            canvasHeight={48}
            customFont="Nexa Light"
          />
        </div>

        <div
          className="colorLegend"
          onClick={() => uiRoriStore.setLegendSettingsPanelType('color')}
        >
          {uiStore.colorIndex > 0 && (
            <ScoreColorLegend
              canvasWidth={min([350, uiStore.componentWidth - 15])}
              canvasHeight={48}
              customFont="Nexa Light"
            />
          )}
          <ClusterColorLegend />
        </div>

      </div>
    </div>
  );
});

export default LegendPanel;
