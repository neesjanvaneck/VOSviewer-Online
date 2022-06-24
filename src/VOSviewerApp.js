import React from 'react';

import VOSviewer from './pages/VOSviewer';

const VOSviewerApp = ({ parameters, fullscreenHandle }) => (
  <VOSviewer queryString={parameters} fullscreenHandle={fullscreenHandle} />

);

export default VOSviewerApp;
