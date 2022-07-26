import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FormControl, Select, InputLabel, MenuItem, Button } from '@mui/material';
import { ColorPicker } from 'material-ui-color';
import { css } from '@emotion/css';
import _join from 'lodash/join';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { clusterColors } from 'utils/variables';
import { getColorScheme } from 'utils/helpers';
import * as s from './styles';

const Colors = observer(() => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [clusterColorSchemeDomain, setClusterColorSchemeDomain] = useState(visualizationStore.clusterColorScheme.domain());

  useEffect(() => {
    setClusterColorSchemeDomain(visualizationStore.clusterColorScheme.domain());
  }, [visualizationStore.lastItemUpdate]);

  const scoreColorsMenuItems = () => visualizationStore.scoreColorSchemeNames.map(scoreColorSchemeName => {
    const colorScheme = getColorScheme(scoreColorSchemeName);
    return (
      <MenuItem key={scoreColorSchemeName.toLowerCase()} value={scoreColorSchemeName.toLowerCase()}>
        <div className={css`
            width: 20px;
            height: 12px;
            display: inline-block;
            margin-right: 5px;
            margin-left: 5px;
            background: ${`linear-gradient(90deg${_join(colorScheme.domain().map(rescaledScore => `, ${colorScheme(rescaledScore)} ${rescaledScore * 100}%`), '')});`};
          `}
        />
        <div className={s.menuItemStyle}>{scoreColorSchemeName}</div>
      </MenuItem>
    );
  });

  const clusterColorPickers = () => clusterColorSchemeDomain.map((key, clusterIndex) => (
    <div className="color-picker" key={key}>
      <div className="color-picker-title">{`Color ${key}`}</div>
      <div className="color-picker-input">
        <ColorPicker
          value={visualizationStore.clusterColorScheme(key)}
          onChange={color => changeClusterColor(uiStore.darkTheme, clusterIndex, `#${color.hex}`)}
          palette={{ ...clusterColors.LIGHT }}
          disableAlpha
          disableTextfield
        />
      </div>
    </div>
  ));

  const changeClusterColor = (darkTheme, clusterIndex, color) => {
    visualizationStore.updateClusterColor(darkTheme, clusterIndex, color);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  const resetClusterColors = (darkTheme) => {
    visualizationStore.resetClusterColors(darkTheme);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  const changeScoreColors = (scoreColorSchemeName) => {
    visualizationStore.updateScoreColorScheme(scoreColorSchemeName);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  return (
    <>
      {uiStore.colorIndex > 0 && (
        <div className="dropdown-box">
          <FormControl className="form-control" style={{ marginBottom: '15px' }}>
            <InputLabel>Color Scheme</InputLabel>
            <Select
              className="select"
              displayEmpty
              value={visualizationStore.scoreColorSchemeName}
              onChange={event => changeScoreColors(event.target.value)}
            >
              {scoreColorsMenuItems()}
            </Select>
          </FormControl>
        </div>
      )}
      {uiStore.colorIndex === 0 && (
        <div className="color-pickers" style={{ position: 'relative' }}>
          {clusterColorPickers()}
        </div>
      )}
      {uiStore.colorIndex === 0 ? (
        <Button
          variant="outlined"
          className="label"
          onClick={() => resetClusterColors(uiStore.darkTheme)}
        >
          Use default colors
        </Button>
      ) : null}
    </>
  );
});

export default Colors;
