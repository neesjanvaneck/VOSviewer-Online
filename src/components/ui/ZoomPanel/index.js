import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Paper, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RemoveIcon from '@mui/icons-material/Remove';

import { ConfigStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const ZoomPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const onZoomIn = () => {
    visualizationStore.zoomIn();
  };

  const onZoomOut = () => {
    visualizationStore.zoomOut();
  };

  const onZoomFit = () => {
    visualizationStore.zoomFit();
  };

  return (
    <>
      {configStore.uiConfig.zoom_panel ? (
        <Paper className={`${s.zoomPanel(configStore.urlPreviewPanelWidth)} ${configStore.urlPreviewPanel ? s.previewIsOpen : ''}`} elevation={3}>
          <Tooltip title="Zoom in" placement="left">
            <div className={s.iconButton} onClick={onZoomIn}>
              <AddIcon className={s.icon} />
            </div>
          </Tooltip>
          <Tooltip title="Zoom out" placement="left">
            <div className={s.iconButton} onClick={onZoomOut}>
              <RemoveIcon className={s.icon} />
            </div>
          </Tooltip>
          <Tooltip title="Reset" placement="left">
            <div className={`${s.iconButton} ${s.borderTop}`} onClick={onZoomFit}>
              <MyLocationIcon className={s.icon} />
            </div>
          </Tooltip>
        </Paper>
      ) : null}
    </>
  );
});

export default ZoomPanel;
