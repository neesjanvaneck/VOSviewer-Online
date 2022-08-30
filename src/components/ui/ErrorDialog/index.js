import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Button, DialogActions, DialogContent } from '@mui/material';

import _isNumber from 'lodash/isNumber';

import Dialog from 'components/ui/Dialog';
import { DataStoreContext, UiStoreContext } from 'store/stores';

const ErrorDialog = observer(() => {
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);

  const errorMessage = () => {
    const error = dataStore.dataError;
    return error && (
      <Typography key={error.key} variant="body1">
        {`Error while reading ${error.dataType}${_isNumber(error.lineNumber) ? ` (line ${error.lineNumber})` : ''}: ${error.message}`}
      </Typography>
    );
  };

  const exitErrorDialogOK = () => {
    uiStore.setErrorDialogIsOpen(false);
  };

  const exitErrorDialogClose = () => {
    uiStore.setErrorDialogIsOpen(false);
  };

  return (
    <Dialog
      open={uiStore.errorDialogIsOpen}
      onClose={exitErrorDialogClose}
    >
      <DialogContent>
        {errorMessage()}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          autoFocus
          onClick={exitErrorDialogOK}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ErrorDialog;
