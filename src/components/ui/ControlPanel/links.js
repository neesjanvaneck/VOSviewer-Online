import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { FormControlLabel, Slider, Switch, TextField, Typography } from '@mui/material';

import { ConfigStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Links = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const changeLinkSizeVariation = (linkSizeVariation, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateLinkLineWidth(uiStore.scale, linkSizeVariation);
      visualizationStore.updateLinks();
    } else {
      uiStore.setLinkSizeVariation(linkSizeVariation);
    }
  };

  const changeMinLinkStrength = (minLinkStrength, checkValidity) => {
    uiStore.setMinLinkStrength(minLinkStrength, checkValidity);
    visualizationStore.updateFilteredAndVisibleLinks(uiStore.minLinkStrength, uiStore.maxNLinks);
    visualizationStore.updateLinks();
  };

  const changeMaxLinks = (maxLinks, checkValidity) => {
    uiStore.setMaxNLinks(maxLinks, checkValidity);
    visualizationStore.updateFilteredAndVisibleLinks(uiStore.minLinkStrength, uiStore.maxNLinks);
    visualizationStore.updateLinks();
  };

  const changeLinksPerFrame = (nLinksPerFrame, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateLinks();
    } else {
      uiStore.setnLinksPerFrame(nLinksPerFrame);
    }
  };

  const changeLinkTransparency = (linkTransparency, updateVisualization) => {
    if (updateVisualization) {
      visualizationStore.updateLinks();
    } else {
      uiStore.setLinkTransparency(linkTransparency);
    }
  };

  const changeColoredLinks = (coloredLinks) => {
    uiStore.setColoredLinks(coloredLinks);
    visualizationStore.updateVisualization(uiStore.dimmingEffect);
  };

  const changeCurvedLinks = (curvedLinks) => {
    uiStore.setCurvedLinks(curvedLinks);
    visualizationStore.updateVisualization(uiStore.dimmingEffect);
  };

  return (
    <>
      {configStore.uiConfig.control_panel.view.link_size_variation
        && (
          <div className={s.sliderBox}>
            <Typography className={s.sliderBoxLabel}>Size variation</Typography>
            <Slider
              value={uiStore.linkSizeVariation}
              min={0}
              max={1}
              step={0.1}
              marks
              track={false}
              valueLabelDisplay="auto"
              onChange={(event, value) => changeLinkSizeVariation(value)}
              onChangeCommitted={(event, value) => changeLinkSizeVariation(value, true)}
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.min_link_strength
        && (
          <div>
            <TextField
              label="Minimum strength"
              type="number"
              inputProps={{ min: 0, max: 10000, step: 1 }}
              value={uiStore.minLinkStrength}
              fullWidth
              onChange={event => changeMinLinkStrength(event.target.value)}
              onBlur={event => changeMinLinkStrength(event.target.value, true)}
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.max_n_links
        && (
          <div>
            <TextField
              label="Maximum links"
              type="number"
              inputProps={{ min: 0, max: 10000, step: 100 }}
              value={uiStore.maxNLinks}
              fullWidth
              onChange={event => changeMaxLinks(event.target.value)}
              onBlur={event => changeMaxLinks(event.target.value, true)}
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.n_links_per_frame
        && (
          <div className={s.sliderBox}>
            <Typography className={s.sliderBoxLabel}>Links per frame</Typography>
            <Slider
              value={uiStore.nLinksPerFrame}
              min={0}
              max={2000}
              step={200}
              marks
              track={false}
              valueLabelDisplay="auto"
              onChange={(event, value) => changeLinksPerFrame(value)}
              onChangeCommitted={(event, value) => changeLinksPerFrame(value, true)}
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.link_transparency
        && (
          <div className={s.sliderBox}>
            <Typography className={s.sliderBoxLabel}>Link transparency</Typography>
            <Slider
              value={uiStore.linkTransparency}
              min={0}
              max={1}
              step={0.1}
              marks
              track={false}
              valueLabelDisplay="auto"
              onChange={(event, value) => changeLinkTransparency(value)}
              onChangeCommitted={(event, value) => changeLinkTransparency(value, true)}
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.colored_links
        && (
          <div className={s.switchBox}>
            <FormControlLabel
              classes={{ root: s.formControlLabel, label: s.switchLabel }}
              control={(
                <Switch
                  checked={uiStore.coloredLinks}
                  onChange={event => changeColoredLinks(event.target.checked)}
                  color="primary"
                />
              )}
              label="Colored links"
              labelPlacement="start"
            />
          </div>
        )
      }
      {configStore.uiConfig.control_panel.view.curved_links
        && (
          <div className={s.switchBox}>
            <FormControlLabel
              classes={{ root: s.formControlLabel, label: s.switchLabel }}
              control={(
                <Switch
                  checked={uiStore.curvedLinks}
                  onChange={event => changeCurvedLinks(event.target.checked)}
                  color="primary"
                />
              )}
              label="Curved links"
              labelPlacement="start"
            />
          </div>
        )
      }
    </>
  );
});

export default Links;
