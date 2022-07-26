import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { ConfigStoreContext } from 'store/stores';
import * as s from './styles';

const Fullscreen = observer(({ enter, exit, active }) => {
  const configStore = useContext(ConfigStoreContext);

  useEffect(() => {
    configStore.setFullscreen(active);
  }, [active]);

  return (
    <>
      {configStore.uiConfig.fullscreen_icon
      && (
        <div
          className={s.fullscreenButton}
          onClick={configStore.fullscreen ? exit : enter}
        >
          <Tooltip title={`${configStore.fullscreen ? 'Exit full screen' : 'Full screen'}`}>
            <IconButton>
              {configStore.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
});

export default Fullscreen;
