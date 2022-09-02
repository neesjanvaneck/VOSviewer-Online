import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';

import { ConfigStoreContext, DataStoreContext, VisualizationStoreContext } from 'store/stores';
import Vizualization from './visualization';
import Items from './items';
import Links from './links';
import ColorSchemes from './colorschemes';
import * as s from './styles';

const View = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate]
  );

  return (
    <>
      {(configStore.uiConfig.control_panel.view.scale)
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Visualization
            </Typography>
            <Vizualization />
          </>
        )
      }
      {(configStore.uiConfig.control_panel.view.item_size
          || configStore.uiConfig.control_panel.view.item_color
          || configStore.uiConfig.control_panel.view.item_size_variation
          || configStore.uiConfig.control_panel.view.max_label_length)
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              {`${dataStore.terminology.items}`}
            </Typography>
            <Items />
          </>
        )
      }
      {(configStore.uiConfig.control_panel.view.link_size_variation
          || configStore.uiConfig.control_panel.view.min_link_strength
          || configStore.uiConfig.control_panel.view.max_n_links
          || configStore.uiConfig.control_panel.view.n_links_per_frame
          || configStore.uiConfig.control_panel.view.link_transparency
          || configStore.uiConfig.control_panel.view.colored_links
          || configStore.uiConfig.control_panel.view.curved_links)
        && visualizationStore.links.length > 0
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              {`${dataStore.terminology.links}`}
            </Typography>
            <Links />
          </>
        )
      }
      {(configStore.uiConfig.control_panel.view.cluster_colors
          || configStore.uiConfig.control_panel.view.score_colors
          || configStore.uiConfig.control_panel.view.gradient_circles
          || configStore.uiConfig.control_panel.view.dimming_effect)
        && (visualizationStore.clusters || visualizationStore.scoreKeys.length > 0)
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Color schemes
            </Typography>
            <ColorSchemes />
          </>
        )
      }
    </>
  );
});

export default View;
