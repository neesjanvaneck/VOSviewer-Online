import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Paper, Tooltip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { ConfigStoreContext, UiStoreContext } from 'store/stores';
import { controlPanelTabValues } from 'utils/variables';
import { PanelTab, PanelTabs } from './tabs';
import View from './view';
import Find from './find';
import Update from './update';
import * as s from './styles';

const { VIEW, FIND, UPDATE } = controlPanelTabValues;

function getControlPanelTabValue(config) {
  let value;
  if (config[VIEW]) value = VIEW;
  else if (config[FIND]) value = FIND;
  else if (config[UPDATE]) value = UPDATE;
  return value;
}

const ControlPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const uiStore = useContext(UiStoreContext);
  const [tabValue, setTabValue] = useState(getControlPanelTabValue(configStore.uiConfig.control_panel));

  useEffect(() => {
    if (configStore.simpleMode && !configStore.fullscreen) uiStore.setControlPanelIsOpen(false);
  }, [configStore.fullscreen]);

  const changeControlPanelTab = (tabValue) => {
    setTabValue(tabValue);
  };

  const showHideControlPanel = () => {
    uiStore.setControlPanelIsOpen();
  };

  return (
    <Paper className={`${s.controlPanel} ${uiStore.controlPanelIsOpen ? s.open : s.closed}`} square>
      {(configStore.tabView || configStore.tabUpdate || configStore.tabFind)
        && (
          <Tooltip title={`${uiStore.controlPanelIsOpen ? 'Hide control panel' : 'Show control panel'}`}>
            <Paper
              className={`${s.closeOpenButton} ${uiStore.controlPanelIsOpen ? s.closeButton : s.openButton}`}
              onClick={showHideControlPanel}
              elevation={3}
            >
              {uiStore.controlPanelIsOpen
              ? <ChevronLeftIcon />
              : <ChevronRightIcon />}
            </Paper>
          </Tooltip>
        )
      }
      <PanelTabs
        value={tabValue}
        onChange={(event, value) => changeControlPanelTab(value)}
        indicatorColor="primary"
      >
        {configStore.tabView
          && <PanelTab value={VIEW} label="View" />
        }
        {configStore.tabFind
          && <PanelTab value={FIND} label="Find" />
        }
        {configStore.tabUpdate
          && <PanelTab value={UPDATE} label="Update" />
        }
      </PanelTabs>
      <div className={s.contentBox}>
        {configStore.tabView
          && tabValue === VIEW
          && <View />
        }
        {configStore.tabFind
          && tabValue === FIND
          && <Find />
        }
        {configStore.tabUpdate
          && tabValue === UPDATE
          && <Update />
        }
      </div>
    </Paper>
  );
});

export default ControlPanel;
