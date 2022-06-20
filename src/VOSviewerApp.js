import React from 'react';

import VOSviewer from './pages/VOSviewer';

const VOSviewerApp = ({ parameters }) => (
  <VOSviewer queryString={parameters} />

);

export default VOSviewerApp;
