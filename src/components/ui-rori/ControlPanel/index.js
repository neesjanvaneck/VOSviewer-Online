import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { FormControl, Select, MenuItem, InputBase } from '@mui/material';
import { color } from 'd3-color';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { roriPantoneCoolGray4, roriPantone299, roriPantone298 } from 'utils/variables-rori';
import * as s from './styles';

const boxShadowColor = color(roriPantone299);
boxShadowColor.opacity = 0.25;

const BootstrapInput = (props) => (
  <InputBase
    {...props}
    sx={{
      '& .MuiSelect-select': {
        borderRadius: '4px',
        position: 'relative',
        border: `1px solid ${roriPantoneCoolGray4}`,
        fontSize: '16px',
        padding: '5px 26px 5px 12px',
        '&:focus': {
          borderRadius: '4px',
          borderColor: `${roriPantone298}`,
          boxShadow: `0 0 0 0.1rem ${boxShadowColor}`,
        },
      }
    }}
  />
);

const ControlPanel = observer(() => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const sizeMenuItems = () => visualizationStore.weightKeysCustomTerminology.map((d, i) => {
    const findMatch = d.match(/<(.*)>/);
    return (
      <MenuItem key={d} value={i}>
        <div className={s.menuItemStyle}>{findMatch ? findMatch[1] : d}</div>
      </MenuItem>
    );
  });

  const colorMenuItems = () => {
    const keys = visualizationStore.clusterKeys.length ? ['Main disciplines', ...visualizationStore.scoreKeys] : visualizationStore.scoreKeys;
    return (
      keys.map((d, i) => {
        const findMatch = d.match(/<(.*)>/);
        return (
          <MenuItem key={d} value={visualizationStore.clusterKeys.length ? i : i + 1}>
            <div className={s.menuItemStyle}>{findMatch ? findMatch[1] : d}</div>
          </MenuItem>
        );
      })
    );
  };

  const changeSize = (sizeIndex) => {
    uiStore.setSizeIndex(sizeIndex);
    visualizationStore.updateWeights(sizeIndex);
    visualizationStore.updateItemFontSizeAndCircleSize(uiStore.scale, uiStore.itemSizeVariation, uiStore.maxLabelLength);
    visualizationStore.updateItems();
  };

  const changeColor = (colorIndex) => {
    uiStore.setColorIndex(colorIndex);
    if (colorIndex > 0) {
      const scoreIndex = colorIndex - 1;
      visualizationStore.updateScores(scoreIndex);
    }
    visualizationStore.updateItems();
  };

  return (
    <div className={s.panel}>
      <div className="flexPanel">
        <div className="item">
          <div className="title">
            Size
          </div>
          <div className="weightSelection">
            <FormControl>
              <Select
                displayEmpty
                value={uiStore.sizeIndex}
                onChange={event => changeSize(event.target.value)}
                input={<BootstrapInput name="weightValue" />}
              >
                {sizeMenuItems()}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="item">
          <div className="title">
            Color
          </div>
          <div className="scoreSelection">
            <FormControl>
              <Select
                displayEmpty
                value={uiStore.colorIndex}
                onChange={event => changeColor(event.target.value)}
                input={<BootstrapInput name="scoreValue" />}
              >
                {colorMenuItems()}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ControlPanel;
