import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, FormControl, Accordion, AccordionDetails, AccordionSummary, FormControlLabel, InputLabel, MenuItem, Select, Switch, Tooltip, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ColorPicker } from 'material-ui-color';
import _join from 'lodash/join';

import { clusterColors } from 'utils/variables';
import { getColorScheme, trimTextEnd } from 'utils/helpers';
import { ConfigStoreContext, DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const ColorSchemes = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [clusterColorSchemeDomain, setClusterColorSchemeDomain] = useState(visualizationStore.clusterColorScheme.domain());

  useEffect(() => {
    setClusterColorSchemeDomain(visualizationStore.clusterColorScheme.domain());
  }, [visualizationStore.lastItemUpdate]);

  const scoreColorsMenuItems = () => visualizationStore.scoreColorSchemeNames.map(scoreColorSchemeName => {
    const rescaledScores = scoreColorSchemeName === 'Custom' && visualizationStore.customScoreColors.map(scoreColor => scoreColor.rescaled_score);
    const colors = scoreColorSchemeName === 'Custom' && visualizationStore.customScoreColors.map(scoreColor => scoreColor.color);
    const colorScheme = getColorScheme(scoreColorSchemeName, rescaledScores, colors);
    return (
      <MenuItem key={scoreColorSchemeName.toLowerCase()} value={scoreColorSchemeName.toLowerCase()}>
        <div className={s.gradientPic(`linear-gradient(90deg${_join(colorScheme.domain().map(rescaledScore => `, ${colorScheme(rescaledScore)} ${rescaledScore * 100}%`), '')});`)} />
        <div style={{ display: 'inline-block' }}>{scoreColorSchemeName}</div>
      </MenuItem>
    );
  });

  const clusterColorPickers = () => clusterColorSchemeDomain.map((key, clusterIndex) => {
    const clusterCustomName = dataStore.clusters.get(key);
    return (
      <div className={s.colorPickerItem} key={key}>
        {clusterCustomName
          ? (clusterCustomName.length > 25 ? (
            <Tooltip title={dataStore.clusters.get(key)} placement="top-start">
              <div className={s.colorPickerTitle(uiStore.darkTheme)}>
                { trimTextEnd(clusterCustomName, 25) }
              </div>
            </Tooltip>
            ) : (
              <div className={s.colorPickerTitle(uiStore.darkTheme)}>
                { clusterCustomName }
              </div>
            ))
            : (
              <div className={s.colorPickerTitle(uiStore.darkTheme)}>
                {`${dataStore.terminology.cluster} ${key}`}
              </div>
            )
        }
        <ColorPicker
          value={visualizationStore.clusterColorScheme(key)}
          onChange={color => changeClusterColor(uiStore.darkTheme, clusterIndex, `#${color.hex}`)}
          palette={{ ...uiStore.darkTheme ? clusterColors.DARK : clusterColors.LIGHT }}
          disableAlpha
          hideTextfield
        />
      </div>
    );
  });

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

  const changeGradientCircles = (gradientCircles) => {
    uiStore.setGradientCircles(gradientCircles);
    visualizationStore.updateVisualization(uiStore.dimmingEffect);
  };

  const changeDimmingEffect = (dimmingEffect) => {
    uiStore.setDimmingEffect(dimmingEffect);
    visualizationStore.updateVisualization(uiStore.dimmingEffect);
  };

  return (
    <>
      {configStore.uiConfig.control_panel.view.cluster_colors
        && visualizationStore.clusters
        && (
          <>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">{`${dataStore.terminology.cluster} colors`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={s.expansionPanelItems(configStore.uiStyle.font_family)}>
                  {clusterColorPickers()}
                  <Button
                    className={`${s.button} ${s.expansionPanelButton}`}
                    variant="outlined"
                    onClick={() => resetClusterColors(uiStore.darkTheme)}
                  >
                    {`Reset ${dataStore.terminology.cluster.toLowerCase()} colors`}
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </>
        )
      }
      {configStore.uiConfig.control_panel.view.score_colors
        && visualizationStore.scoreKeys.length > 0
        && (
          <FormControl>
            <InputLabel>Score colors</InputLabel>
            <Select
              displayEmpty
              value={visualizationStore.scoreColorSchemeName}
              onChange={event => changeScoreColors(event.target.value)}
            >
              {scoreColorsMenuItems()}
            </Select>
          </FormControl>
        )
      }
      {configStore.uiConfig.control_panel.view.gradient_circles
        && (
          <div className={s.switchBox}>
            <FormControlLabel
              classes={{ root: s.formControlLabel, label: s.switchLabel }}
              control={(
                <Switch
                  checked={uiStore.gradientCircles}
                  onChange={event => changeGradientCircles(event.target.checked)}
                  color="primary"
                />
              )}
              label="Gradient circles"
              labelPlacement="start"
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.dimming_effect
        && (
          <div className={s.switchBox}>
            <FormControlLabel
              classes={{ root: s.formControlLabel, label: s.switchLabel }}
              control={(
                <Switch
                  checked={uiStore.dimmingEffect}
                  onChange={event => changeDimmingEffect(event.target.checked)}
                  color="primary"
                />
              )}
              label="Dimming effect"
              labelPlacement="start"
            />
          </div>
        )
      }
    </>
  );
});

export default ColorSchemes;
