import React from 'react';

import Dimensions from './pages/Dimensions';

const DimensionsApp = ({ parameters, fullscreenHandle }) => (
  <Dimensions queryString={parameters} fullscreenHandle={fullscreenHandle} />
);

export default DimensionsApp;
