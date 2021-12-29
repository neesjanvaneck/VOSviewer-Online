/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { ConfigStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Screenshot = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const screenshotEl = useRef(null);

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate]
  );

  const saveScreenshot = (fileFormat) => {
    screenshotEl.current.href = visualizationStore.getScreenshotImage(fileFormat);
    screenshotEl.current.download = `VOSviewer-screenshot.${fileFormat}`;
    screenshotEl.current.click();
  };

  return (
    <>
      {configStore.uiConfig.screenshot_icon
      && visualizationStore.items.length > 0
      && (
        <>
          <div className={s.screenshotButton}>
            <Tooltip title="Screenshot">
              <IconButton aria-controls="screenshot-menu" onClick={() => saveScreenshot('png')}>
                <PhotoCameraIcon />
              </IconButton>
            </Tooltip>
            <a ref={screenshotEl} style={{ display: 'none' }} />
          </div>
        </>
      )}
    </>
  );
});

export default Screenshot;
