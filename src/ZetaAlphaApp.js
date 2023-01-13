import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import ZetaAlpha from './pages/ZetaAlpha';

const ZetaAlphaApp = ({ parameters, fullscreenHandle, jsonData }) => (
  <ScopedCssBaseline>
    <ZetaAlpha queryString={parameters} fullscreenHandle={fullscreenHandle} jsonData={jsonData} />
  </ScopedCssBaseline>
);

export default ZetaAlphaApp;
