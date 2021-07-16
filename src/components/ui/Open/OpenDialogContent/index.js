import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { ConfigStoreContext, FileDataStoreContext, UiStoreContext } from 'store/stores';
import JsonFileChooser from './json';
import MapFileChooser from './map';
import NetworkFileChooser from './network';
import * as s from './styles';

const OpenDialogContent = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);

  const clearMap = () => {
    uiStore.resetMapFileSelectedName();
    fileDataStore.setMapFile(undefined);
  };

  const clearNetwork = () => {
    uiStore.resetNetworkFileSelectedName();
    fileDataStore.setNetworkFile(undefined);
  };

  const clearJson = () => {
    uiStore.resetJsonFileSelectedName();
    fileDataStore.setJsonFile(undefined);
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
                {fileDataStore.jsonFile && <CancelRoundedIcon fontSize="small" onClick={clearJson} />}
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
                  {fileDataStore.mapFile && <CancelRoundedIcon fontSize="small" onClick={clearMap} />}
                </div>
              </div>
              <div className={s.fileBox}>
                <NetworkFileChooser />
                <div className={s.fileNameBox(configStore.uiStyle)}>
                  <Typography variant="body2">{uiStore.networkFileSelectedName}</Typography>
                  {fileDataStore.networkFile && <CancelRoundedIcon fontSize="small" onClick={clearNetwork} />}
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
