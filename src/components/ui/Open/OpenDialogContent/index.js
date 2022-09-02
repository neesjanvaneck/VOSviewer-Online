import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { ConfigStoreContext, DataStoreContext, UiStoreContext } from 'store/stores';
import JsonFileChooser from './json';
import MapFileChooser from './map';
import NetworkFileChooser from './network';
import * as s from './styles';

const OpenDialogContent = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);

  const clearMap = () => {
    uiStore.resetMapFileSelectedName();
    dataStore.setMapFile(undefined);
  };

  const clearNetwork = () => {
    uiStore.resetNetworkFileSelectedName();
    dataStore.setNetworkFile(undefined);
  };

  const clearJson = () => {
    uiStore.resetJsonFileSelectedName();
    dataStore.setJsonFile(undefined);
  };

  return (
    <>
      <FormControl>
        <InputLabel>File type</InputLabel>
        <Select displayEmpty value={uiStore.fileType} onChange={event => uiStore.setFileType(event.target.value)} name="method">
          <MenuItem key="vosviewer-json" value="vosviewer-json">
            VOSviewer JSON file
          </MenuItem>
          <MenuItem key="vosviewer-map-network" value="vosviewer-map-network">
            VOSviewer map and network file
          </MenuItem>
        </Select>
      </FormControl>
      <div>
        {uiStore.fileType === 'vosviewer-json'
          && (
            <div className={s.fileBox}>
              <JsonFileChooser />
              <div className={s.fileNameBox(configStore.uiStyle)}>
                <Typography variant="body2">{uiStore.jsonFileSelectedName}</Typography>
                {dataStore.jsonFile && <CancelRoundedIcon fontSize="small" onClick={clearJson} />}
              </div>
            </div>
          )
        }
        {uiStore.fileType === 'vosviewer-map-network'
          && (
            <>
              <div className={s.fileBox}>
                <MapFileChooser />
                <div className={s.fileNameBox(configStore.uiStyle)}>
                  <Typography variant="body2">{uiStore.mapFileSelectedName}</Typography>
                  {dataStore.mapFile && <CancelRoundedIcon fontSize="small" onClick={clearMap} />}
                </div>
              </div>
              <div className={s.fileBox}>
                <NetworkFileChooser />
                <div className={s.fileNameBox(configStore.uiStyle)}>
                  <Typography variant="body2">{uiStore.networkFileSelectedName}</Typography>
                  {dataStore.networkFile && <CancelRoundedIcon fontSize="small" onClick={clearNetwork} />}
                </div>
              </div>
            </>
          )
        }
      </div>
      <div>
        {uiStore.fileType === 'vosviewer-map-network'
          && (
            <Typography variant="body2" component="div" className={s.hint}>
              Select a map file and/or a network file.
            </Typography>
          )
        }
      </div>
    </>
  );
});

export default OpenDialogContent;
