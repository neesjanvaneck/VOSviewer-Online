import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';

export const PanelTabs = withStyles({
  flexContainer: {
    borderBottom: '1px solid #e8e8e8',
  }
})(props => <Tabs {...props} indicatorColor="primary" textColor="primary" centered />);

export const PanelTab = withStyles(() => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: 500,
  },
}))(props => <Tab disableRipple {...props} />);
