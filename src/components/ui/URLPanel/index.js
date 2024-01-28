import React, { useContext, useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { CardMedia, Paper } from '@mui/material';
import _throttle from 'lodash/throttle';

import { ConfigStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const URLPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [url, setUrl] = useState(undefined);

  const throttledSetUrl = useCallback(_throttle((value) => {
    setUrl(value);
  }, 1000), []);


  useEffect(() => {
    const { hoveredItem, clickedItem, hoveredLink, clickedLink } = visualizationStore;
    if (clickedItem || clickedLink) {
      throttledSetUrl((clickedItem && clickedItem.url) || (clickedLink && clickedLink.url));
    } else if (hoveredItem || hoveredLink) {
      throttledSetUrl((hoveredItem && hoveredItem.url) || (hoveredLink && hoveredLink.url));
    } else throttledSetUrl(undefined);
  }, [visualizationStore.hoveredItem, visualizationStore.clickedItem, visualizationStore.hoveredLink, visualizationStore.clickedLink]);

  return (
    <>
      {configStore.urlPreviewPanel
        && (
          <Paper className={s.urlPreviewPanel(configStore.urlPreviewPanelWidth)} square>
            <div className={s.urlPreviewContent}>
              {url
              && (
                <CardMedia
                  component="iframe"
                  src={url}
                  classes={{ root: s.iframeBox }}
                />
              )}
            </div>
          </Paper>
        )
      }
    </>
  );
});

export default URLPanel;
