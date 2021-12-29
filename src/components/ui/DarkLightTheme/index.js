import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip, IconButton } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { ConfigStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const DarkLightTheme = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  const changeDarkTheme = () => {
    const darkTheme = !uiStore.darkTheme;
    uiStore.setDarkTheme(darkTheme);
    visualizationStore.updateClusterColors(darkTheme);
    visualizationStore.updateItems();
    visualizationStore.updateLinks();
  };

  return (
    <>
      {configStore.uiConfig.background_icon
      && (
        <div className={s.themeButton}>
          <Tooltip title={`${uiStore.darkTheme ? 'Light user interface' : 'Dark user interface'}`}>
            <IconButton onClick={changeDarkTheme}>
              {uiStore.darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
});

export default DarkLightTheme;
