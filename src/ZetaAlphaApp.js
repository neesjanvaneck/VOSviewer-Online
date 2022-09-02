import React from 'react';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import ZetaAlpha from './pages/ZetaAlpha';

const ZetaAlphaApp = ({ parameters, fullscreenHandle }) => (
  <ScopedCssBaseline>
    <ZetaAlpha queryString={parameters} fullscreenHandle={fullscreenHandle} />
  </ScopedCssBaseline>
);

export default ZetaAlphaApp;
