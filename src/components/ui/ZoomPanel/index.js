import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Paper, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import RemoveIcon from '@material-ui/icons/Remove';

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
