import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog as MuiDialog } from '@mui/material';

import { UiStoreContext } from 'store/stores';

const Dialog = observer((props) => {
  const uiStore = useContext(UiStoreContext);

  return (
    <MuiDialog
      {...props}
      container={uiStore.rootEl}
      sx={{
        position: 'absolute',
        '.MuiBackdrop-root': {
          position: 'absolute',
        }
      }}
    />
  );
});

export default Dialog;
