import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import Dimensions from './pages/Dimensions';

const DimensionsApp = ({ parameters, fullscreenHandle }) => (
  <ScopedCssBaseline>
    <Dimensions queryString={parameters} fullscreenHandle={fullscreenHandle} />
  </ScopedCssBaseline>
);

export default DimensionsApp;
