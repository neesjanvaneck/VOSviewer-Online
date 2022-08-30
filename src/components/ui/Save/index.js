/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { ConfigStoreContext, DataStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Save = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const jsonFileEl = useRef(null);

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate]
  );

  const saveJsonFile = () => {
    const jsonData = visualizationStore.getJsonData(dataStore.getTerminology(), dataStore.getTemplates(), dataStore.getStyles(), dataStore.parameters, dataStore.getColorSchemes(), dataStore.getClusters());
    const data = JSON.stringify(jsonData, null, 4);
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const dataURL = URL.createObjectURL(blob);
    jsonFileEl.current.href = dataURL;
    jsonFileEl.current.download = `VOSviewer-network.json`;
    jsonFileEl.current.click();
  };

  return (
    <>
      {configStore.uiConfig.save_icon
      && visualizationStore.items.length > 0
      && (
        <>
          <div className={s.saveButton}>
            <Tooltip title="Save">
              <IconButton onClick={saveJsonFile}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <a ref={jsonFileEl} style={{ display: 'none' }} />
          </div>
        </>
      )}
    </>
  );
});

export default Save;
