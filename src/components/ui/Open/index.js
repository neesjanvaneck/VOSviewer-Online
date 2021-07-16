import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FolderIcon from '@material-ui/icons/Folder';

import {
  ConfigStoreContext, FileDataStoreContext, UiStoreContext, WebworkerStoreContext
} from 'store/stores';
import OpenDialogContent from './OpenDialogContent';
import * as s from './styles';

const Open = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);
  const [isOpen, setIsOpen] = useState(false);

  const showOpenDialog = () => {
    setIsOpen(!isOpen);
  };

  const exitOpenDialog = () => {
    setIsOpen(!isOpen);
  };

  const openMapNetworkFile = () => {
    exitOpenDialog();
    if (fileDataStore.mapFile || fileDataStore.networkFile) {
      webworkerStore.openMapNetworkFile(fileDataStore.mapFile, fileDataStore.networkFile, true);
    }
  };

  const openJsonFile = () => {
    exitOpenDialog();
    if (fileDataStore.jsonFile) {
      webworkerStore.openJsonFile(fileDataStore.jsonFile, true);
    }
  };

  return (
    <>
      {configStore.uiConfig.open_icon
        && (
          <div
            className={s.openButton}
            onClick={showOpenDialog}
          >
            <Tooltip title="Open">
              <IconButton>
                <FolderIcon />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
      <Dialog
        open={isOpen}
        onClose={exitOpenDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Open</DialogTitle>
        <DialogContent classes={{ root: s.dialogContent }}>
          <IconButton className={s.closeButton} onClick={exitOpenDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <OpenDialogContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={uiStore.fileType === 'vosviewer-map-network' ? openMapNetworkFile : openJsonFile} color="primary">
            OK
          </Button>
          <Button onClick={exitOpenDialog} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Open;
