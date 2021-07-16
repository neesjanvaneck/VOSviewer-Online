import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Tooltip } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import { ConfigStoreContext } from 'store/stores';
import * as s from './styles';

const Fullscreen = observer(() => {
  const configStore = useContext(ConfigStoreContext);

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      configStore.setFullscreen(document.fullscreen);
    }, false);

    document.addEventListener("mozfullscreenchange", () => {
      configStore.setFullscreen(document.fullscreen);
    }, false);

    document.addEventListener("webkitfullscreenchange", () => {
      configStore.setFullscreen(document.fullscreen);
    }, false);
  }, []);

  // https://gist.github.com/simonewebdesign/6183356

  const changeFullscreen = () => {
    if (configStore.fullscreen) {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    } else {
      const el = document.body;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
  };

  return (
    <>
      {configStore.uiConfig.fullscreen_icon
      && (
        <div
          className={s.fullscreenButton}
          onClick={changeFullscreen}
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
