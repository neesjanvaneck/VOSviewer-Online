import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import VOSviewer from './pages/VOSviewer';

const VOSviewerApp = ({ parameters, fullscreenHandle }) => (
  <ScopedCssBaseline>
    <VOSviewer queryString={parameters} fullscreenHandle={fullscreenHandle} />
  </ScopedCssBaseline>
);

export default VOSviewerApp;
