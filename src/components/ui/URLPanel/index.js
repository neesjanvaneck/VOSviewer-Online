import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CardMedia, Paper } from '@mui/material';

import { ConfigStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const URLPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    const { hoveredItem, clickedItem, hoveredLink, clickedLink } = visualizationStore;
    if (clickedItem || clickedLink) {
      setUrl((clickedItem && clickedItem.url) || (clickedLink && clickedLink.url));
    } else if (hoveredItem || hoveredLink) {
      setUrl((hoveredItem && hoveredItem.url) || (hoveredLink && hoveredLink.url));
    } else setUrl(undefined);
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
