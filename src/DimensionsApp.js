import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import Dimensions from './pages/Dimensions';

const DimensionsApp = ({ parameters, fullscreenHandle, jsonData }) => (
  <ScopedCssBaseline>
    <Dimensions queryString={parameters} fullscreenHandle={fullscreenHandle} jsonData={jsonData} />
  </ScopedCssBaseline>
);

export default DimensionsApp;
