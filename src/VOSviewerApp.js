import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import VOSviewer from './pages/VOSviewer';

const VOSviewerApp = ({ parameters, fullscreenHandle, jsonData }) => (
  <ScopedCssBaseline>
    <VOSviewer queryString={parameters} fullscreenHandle={fullscreenHandle} jsonData={jsonData} />
  </ScopedCssBaseline>
);

export default VOSviewerApp;
