import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, DialogActions, DialogContent, Typography } from '@mui/material';

import Dialog from 'components/ui/Dialog';
import { DataStoreContext, UiStoreContext, VisualizationStoreContext, WebworkerStoreContext } from 'store/stores';

const UnconnectedItemsDialog = observer(() => {
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const webworkerStore = useContext(WebworkerStoreContext);

  const exitUnconnectedItemsDialogYes = () => {
    webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: 'yes', mapData: dataStore.mapData, networkData: dataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
    uiStore.setUnconnectedItemsDialog(false);
    uiStore.setUnconnectedItemsDialogIsOpen(false);
  };

  const exitUnconnectedItemsDialogNo = () => {
    webworkerStore.startHandleUnconnectedItems({ unconnectedItemsDialogChoice: 'no', mapData: dataStore.mapData, networkData: dataStore.networkData, itemIdToIndex: visualizationStore.itemIdToIndex });
    uiStore.setUnconnectedItemsDialog(false);
    uiStore.setUnconnectedItemsDialogIsOpen(false);
  };

  return (
    <Dialog
      open={uiStore.unconnectedItemsDialogIsOpen}
    >
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {`Some of the ${uiStore.unconnectedItemsDialogNItemsNetwork} items in your network are not connected to each other.`}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {`The largest set of connected items consists of ${uiStore.unconnectedItemsDialogNItemsLargestComponent} items.`}
        </Typography>
        <Typography variant="body1">
          Do you want to show this set of items instead of all items?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          autoFocus
          onClick={exitUnconnectedItemsDialogYes}
        >
          Yes
        </Button>
        <Button
          color="primary"
          onClick={exitUnconnectedItemsDialogNo}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UnconnectedItemsDialog;
