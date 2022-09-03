import React from 'react';
import { Tab, Tabs } from '@mui/material';

export const PanelTabs = (props) => (
  <Tabs
    {...props}
    indicatorColor="primary"
    textColor="primary"
    centered
    sx={{
      borderBottom: 1,
      borderColor: 'divider'
    }}
  />
);

export const PanelTab = (props) => (
  <Tab
    disableRipple
    {...props}
    sx={{
      textTransform: 'none',
      minWidth: 72,
      fontWeight: 500,
    }}
  />
);
