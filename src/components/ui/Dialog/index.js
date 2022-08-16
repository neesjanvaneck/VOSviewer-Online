import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog as MuiDialog } from '@mui/material';

import { UiStoreContext, ConfigStoreContext } from 'store/stores';
import { getFullscreenOrBodyContainer } from 'utils/helpers'

const Dialog = observer((props) => {
  const uiStore = useContext(UiStoreContext);
  const configStore = useContext(ConfigStoreContext);

  return (
    <MuiDialog
      {...props}
      container={() => (configStore.fullscreen ? getFullscreenOrBodyContainer() : uiStore.rootEl)}
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
