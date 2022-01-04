import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography } from '@mui/material';

import { ConfigStoreContext, VisualizationStoreContext } from 'store/stores';
import Normalization from './normalization';
import Layout from './layout';
import Clustering from './clustering';
import RotateFlip from './rotateflip';
import * as s from './styles';

const Update = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate]
  );

  return (
    <>
      {configStore.uiConfig.control_panel.update.rotate_flip
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Rotate / flip
            </Typography>
            <RotateFlip />
          </>
        )
      }
      {configStore.uiConfig.control_panel.update.normalization
        && visualizationStore.links.length > 0
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Normalization
            </Typography>
            <Normalization />
          </>
        )
      }
      {configStore.uiConfig.control_panel.update.layout
        && visualizationStore.links.length > 0
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Layout
            </Typography>
            <Layout />
          </>
        )
      }
      {configStore.uiConfig.control_panel.update.clustering
        && visualizationStore.links.length > 0
        && (
          <>
            <Typography className={s.subtitle} variant="subtitle2">
              Clustering
            </Typography>
            <Clustering />
          </>
        )
      }
    </>
  );
});

export default Update;
