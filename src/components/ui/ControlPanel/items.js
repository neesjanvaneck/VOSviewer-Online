import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography
} from '@mui/material';

import { ConfigStoreContext, DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Items = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate, visualizationStore.weightKeysCustomTerminology, visualizationStore.scoreKeys]
  );

  const sizeMenuItems = () => visualizationStore.weightKeysCustomTerminology.map((d, i) => {
    const findMatch = d.match(/<(.*)>/);
    const label = findMatch ? findMatch[1] : (d === 'weight' ? 'Custom' : d);
    return (
      <MenuItem key={d} value={i}>
        {label}
      </MenuItem>
    );
  });

  const colorMenuItems = () => {
    const keys = [dataStore.terminology.clusters, ...visualizationStore.scoreKeys];
    return keys.map((d, i) => {
      const findMatch = d.match(/<(.*)>/);
      const label = i === 0 ? d : (findMatch ? findMatch[1] : (d === 'score' ? 'Custom' : d));
      return (
        <MenuItem key={d} value={i}>
          {label}
        </MenuItem>
      );
    });
  };

  const changeSize = (sizeIndex) => {
    uiStore.setSizeIndex(sizeIndex);
    visualizationStore.updateWeights(sizeIndex);
    visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, uiStore.itemSizeVariation, uiStore.maxLabelLength, configStore.uiStyle.font_family);
    visualizationStore.updateItems();
  };

  const changeColor = (colorIndex) => {
    uiStore.setColorIndex(colorIndex);
    if (colorIndex > 0) {
      const scoreIndex = colorIndex - 1;
      visualizationStore.updateScores(scoreIndex);
    }
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  const changeItemSizeVariation = (itemSizeVariation, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, itemSizeVariation, uiStore.maxLabelLength, configStore.uiStyle.font_family);
      visualizationStore.updateItems();
    } else {
      uiStore.setItemSizeVariation(itemSizeVariation);
    }
  };

  const changeMaxLabelLength = (maxLabelLength, checkValidity) => {
    uiStore.setMaxLabelLength(maxLabelLength, checkValidity);
    visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, uiStore.itemSizeVariation, uiStore.maxLabelLength, configStore.uiStyle.font_family);
    visualizationStore.updateItems();
  };

  return (
    <>
      {configStore.uiConfig.control_panel.view.item_size
        && visualizationStore.weightKeysCustomTerminology.length > 0
        && (
          <FormControl>
            <InputLabel>Size</InputLabel>
            <Select
              displayEmpty
              value={uiStore.sizeIndex}
              onChange={event => changeSize(event.target.value)}
            >
              {sizeMenuItems()}
            </Select>
          </FormControl>
        )
      }
      {configStore.uiConfig.control_panel.view.item_color
        && (visualizationStore.clusters || visualizationStore.scoreKeys.length > 0)
        && (
          <FormControl>
            <InputLabel>Color</InputLabel>
            <Select
              displayEmpty
              value={uiStore.colorIndex}
              onChange={event => changeColor(event.target.value)}
            >
              {colorMenuItems()}
            </Select>
          </FormControl>
        )
      }
      {configStore.uiConfig.control_panel.view.item_size_variation
        && (
          <div className={s.sliderBox}>
            <Typography className={s.sliderBoxLabel}>Size variation</Typography>
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
        )
      }
      {configStore.uiConfig.control_panel.view.max_label_length
        && (
          <TextField
            label="Maximum label length"
            type="number"
            inputProps={{ min: 0, max: 300, step: 1 }}
            value={uiStore.maxLabelLength}
            fullWidth
            onChange={event => changeMaxLabelLength(event.target.value)}
            onBlur={event => changeMaxLabelLength(event.target.value, true)}
          />
        )
      }
    </>
  );
});

export default Items;
